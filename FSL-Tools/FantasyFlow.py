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