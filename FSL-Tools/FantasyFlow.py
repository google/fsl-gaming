#!/usr/bin/python
#
# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""TODO: High-level file comment."""

import sys

def main(argv):
    pass

if __name__ == '__main__':
    main(sys.argv)

from locust import task, HttpUser
import json
import random
import time
import sys

class MyUser(HttpUser):
    host = "https://fsl.danielnwang.demo.altostrat.com"

    @task
    def index(self):
        self.client.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        contestUuid = 'a175ace5-e8ed-4f95-bf6c-e99f0f4bc92e'
        number = ''
        number = str(random.randint(6, 9))
        for i in range(1, 10):
            number += str(random.randint(0, 9))
        print(number)
        self.number = number
        userResp = self.client.post("/resource-management/api/user", data=json.dumps({"mobileNumber": number}))
        print(userResp.text)
        userresp = json.loads(userResp.text)
        userUuid = userresp['data']['userUuid']
        print('User Uuid -', userUuid)

        ft1Resp = self.client.post("/resource-management/api/fantasy-team-details", data=json.dumps({"userUuid": userUuid, "contestUuid": contestUuid}))
        # time.sleep(0.02)
        ft1Resp = json.loads(ft1Resp.text)
        if ft1Resp['status'] != 200:
            print('Contest Full')
        else:
            fantasyTeamUuid = ft1Resp['data']['fantasyTeamUuid']
            print('Fantasy Team Uuid -', fantasyTeamUuid)
            
            ftsResp = self.client.post("/resource-management/api/fantasy-team-squad-details-bulk",data=json.dumps({"fantasyTeamUuid": fantasyTeamUuid}))
            ftsResp = json.loads(ftsResp.text)
            
        time.sleep(1)