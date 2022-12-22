from locust import task, HttpUser
import json
class MyUser(HttpUser):
    host = "http://localhost:5007"
    @task
    
    def index(self):
    	self.client.headers.update({
    	'Content-Type': 'application/json',
    	'Accept': 'application/json'
    	})
    	resp = self.client.post("/user/api/createTeam",data=json.dumps({
    	"teamUuid": "00c138ac-9a89-4549-8810-592139112e64"
    	}))
    	print(resp.text)
