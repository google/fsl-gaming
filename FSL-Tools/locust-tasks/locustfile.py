from locust import TaskSet, task, HttpUser, FastHttpUser
import logging 
import json
import random

class MyUser(HttpUser):
    host = "https://fsl.danielnwang.demo.altostrat.com"

    @task
    def index(self):
        self.client.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        try:
            contestUuid = '6ecc76c1-3bfa-4c5f-b0df-5b10acf220eb'
            number = str(random.randint(6, 9))
            for i in range(1, 10):
                number += str(random.randint(0, 9))
            userResp = self.client.post("/resource-management/api/user", data=json.dumps({"mobileNumber": number}))
            userresp = json.loads(userResp.text)
            userUuid = userresp['data']['userUuid']

            ft1Resp = self.client.post("/resource-management/api/fantasy-team-details", data=json.dumps({"userUuid": userUuid, "contestUuid": contestUuid}))
            # time.sleep(0.02)

            ft1Resp = json.loads(ft1Resp.text)
            if ft1Resp['status'] == 200:
                fantasyTeamUuid = ft1Resp['data']['fantasyTeamUuid']
                self.client.post("/resource-management/api/fantasy-team-squad-details-bulk",data=json.dumps({"fantasyTeamUuid": fantasyTeamUuid}))
        except Exception as e: 
            print(e)


