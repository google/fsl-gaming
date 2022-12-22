import imp
from locust import task, HttpUser
import json
import random
import time
import sys

class MyUser(HttpUser):
    host = "http://fsl-gaming.niveussolutions.com"

    @task
    def index(self):
        self.client.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        contestUuid = '4b22b767-edbf-4094-8e29-14a978d8f54c'
        number = ''
        number = str(random.randint(6, 9))
        for i in range(1, 10):
            number += str(random.randint(0, 9))
        print(number)
        self.number = number
        userResp = self.client.post("/resource-management/api/createUser", data=json.dumps({"mobileNumber": number}))
        userresp = json.loads(userResp.text)
        userUuid = userresp['data']['userUuid']
        print(userUuid)

        ft1Resp = self.client.post("/resource-management/api/createFantasyTeamDetails", data=json.dumps({"userUuid": userUuid, "contestUuid": contestUuid}))
        # time.sleep(0.02)
        ft1Resp = json.loads(ft1Resp.text)
        if ft1Resp['status'] != 200:
            print('Contest Full')
        else:
            fantasyTeamUuid = ft1Resp['data']['fantasyTeamUuid']
            print('Fantasy Team Uuid -', fantasyTeamUuid)
            
            ftsResp = self.client.post("/resource-management/api/createFantasyTeamSquadDetailsBulk",data=json.dumps({"fantasyTeamUuid": fantasyTeamUuid}))
            ftsResp = json.loads(ftsResp.text)
            
        print('***********************************************************************************')
        print('###################################################################################')
        print('***********************************************************************************')
        time.sleep(2)