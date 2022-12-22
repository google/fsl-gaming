from locust import task, HttpUser
import json


class MyUser(HttpUser):
    host = "http://localhost:5004"

    @task
    def index(self):
        self.client.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        resp = self.client.get(
            "/display-leaderboard/api/getContestLeaderBoard/41134b1b-fda8-47f5-9048-0d92e643d4ae")
        print(resp.text)
