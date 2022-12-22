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
    	resp = self.client.post("/user/api/createContest",data=json.dumps({
    	"matchUuid": "069efb0d-e196-45fb-961a-99dd2674f2f1"
    	}))
    	print(resp.text)
