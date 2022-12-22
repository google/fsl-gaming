# FSL-Display-Leaderboard
FSL-Display-Leaderboard project contains display contest leaderboard and fantasy team player leader board apis. These api's will help you to fetch the points for a fantasy-teams and the players in leaderboard. 
To run the FSL-Display-Leaderboard project  you need to have one more project FSL-Backend-Common in same root directory then only you can follow the below steps for execution for project.
Before running the FSL-Update-Leaderboard project you need to open the FSL-Backend Common project. It contains the constants,database connection, utils files, database schema and functions needed to run FSL-Display-Leaderboard project 

Use the below command to go the backend-common directory
```sh 
cd FSL-Backend-Common
```

In the project directory,Install all the project dependencies for the FSL-Backend Common
 ```sh
 npm install
 ```
Now open the FSL-Display-Leaderboard directory

```sh
cd FSL-Update-Leaderboard
```

Install all the project dependencies for FSL-Display-Leaderboard run below command:
 ```sh
 npm install
 ```
 Before running the FSL-Display-Leaderboard project need to add .env file to the project directory
 Below is the example for .env file:
 ```
NODE_ENV={Specify  your project environment }
SPANNER_INSTANCE={INSTANCE NAME}
SPANNER_DATABASE={SPANNER DATABASE NAME}
PROJECT_ID={GCP PROJECT-ID}
FSL_Resource_REDIS_URL='{REDIS-URL}/Database-Id'
REDIS_URL='{REDIS-URL}/Database-Id'
PORT={Specify the Port Number}
 ```
 Now run below command:
 
```sh
 npm start
 ```

Runs the server in the development mode.
Open [http://localhost:{PORT}](http://localhost:{PORT}) to view it in the browser.

The page will reload if you make edits.\

## Build Docker image 
Run below command:
```sh
sudo docker build . -t fsl-user:latest
```
## Run Docker image 
Run below command:
```sh
sudo docker run -dp 5001:5001  fsl-user:latest
```

## Run Application for Local development through docker 
Run below command:
```sh
cd ../FSL-Backend-Common/docker
sudo docker-compose up dev-user-backend-fsl
```