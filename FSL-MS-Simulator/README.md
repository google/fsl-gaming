# FSL-GAMING
FSL Gaming is a cricket based fantasy game where a live match between two teams are played and users create their own virtual teams based out of cricket team of 11 players from a forthcoming match and the primary goal in this fantasy cricket game is to score as many points as possible and climb the leaderboard by defeating your opponents. 
### Pre requisite
To Run FSL- Gamming you need to have
 - Node JS
 - Google Kubernetes Engine
 - Google Spanner
 - Pub/Sub
 - Memorystore (Redis) 
## How to Run Script

Create a project folder /home/$user/fsl-game then checkout all the repos in this folder so the project folder will look like this
 /home/$user/fsl-game
     -- FSL-Backend-Common
     -- FSL-Resource-Management
     -- FSL-Update-Leaderboard
     -- FSL-Display-Leaderboard
     -- FSL-Simulator
The following are the steps to run FSL-Gaming application
### Step 1 :  FSL-Backend-Common
The  FSL-Backend-Common contains the constants,database connection, utils files,config, database schema and functions needed to run all other micro services.

Use the below command to go the backend-common directory
```sh 
cd FSL-Backend-Common
```
In the project directory,Install all the project dependencies for the FSL-Backend Common
 ```sh
 npm install
 ```
 ### Step 2 :  FSL-Resource-Management
 FSL-Resource-Management project contains all the CRUD operation api's needed to run the FSL-gamming. It contains api's for Users,Teams,Match,Contest,Fantasy-team.
To run the FSL-Resource-Management project you need to have one more project FSL-Backend-Common in same root directory then only you can follow the below steps for execution for project.

Now open the Resource-Management directory

```sh
cd FSL-MS-Resource-Management
```

Install all the project dependencies for FSL-MS-Resource-Management run below command:
 ```sh
 npm install
 ```
 Before running the any project in FSL-Gaming need to add .env file to the project directory
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

### Step 3:  FSL-Update-Leaderboard
FSL-Update-Leaderboard project contains update contest leaderboard and fantasy team player leader board apis. These api's will help you to upadte the points for a fantasy-teams and the players in leaderboard.
Now open the FSL-Update-Leaderboard

```sh
cd FSL-Update-Leaderboard
```
Install all the project dependencies for FSL-Update-Leaderboard run below command:
 ```sh
 npm install
 ```
 run below command to run scripts:
 
```sh
 npm start
 ```

Runs the server in the development mode.
Open [http://localhost:{PORT}](http://localhost:{PORT}) to view it in the browser.

### Step 4: simulatorListener
simulatorListner is a pub/sub listner which will recive message from simulate ball api. This listner then finds the count player and fanatsy team to be updated for the ball from spanner and then  publishes the message for updatescore listner to update score in spanner as well as in memorystore.This file is present in the FSL-Update-Leaderboard directory

run below command to run scripts:
 
```sh
 node simulatorListener.js
 ```
### Step 5: updateScoreListener
updateScoreListener is a pub/sub listner which will revice message from simulatorListner with data and using this data it will make a call to update score api.This file is present in the FSL-Update-Leaderboard directory
run below command to run scripts:
 
```sh
 node updateScoreListener.js
 ```
 ### Step 6: updateRedisListener
 updateRedisListener is a pub/sub listner which will revice message from update Score api with data and using this data it will update the points in memorystore. After updating points it will send message for updateToSpanner to update score in spanner.This file is present in the FSL-Update-Leaderboard directory
 ```sh
 node updateRedisListener.js
 ```
 ### Step 7: updateToSpannerListener
 updateToSpannerListener is a pub/sub listner which will revice message from updateRedisListener with data and using this data it will update score in Spanner.This file is present in the FSL-Update-Leaderboard directory
 ```sh
 node updateToSpannerListener.js
 ```
 
 
### Step 8: FSL-Display-Leaderboard
FSL-Display-Leaderboard project contains display contest leaderboard and fantasy team player leader board apis. These api's will help you to fetch the points for a fantasy-teams and the players in leaderboard.

Now open the FSL-Display-Leaderboard

```sh
cd FSL-Display-Leaderboard
```
Install all the project dependencies for FSL-Display-Leaderboard run below command:
 ```sh
 npm install
 ```
Now run below command to run scripts:
 
```sh
 npm start
 ```

Runs the server in the development mode.
Open [http://localhost:{PORT}](http://localhost:{PORT}) to view it in the browser.


### Step 9: FSL-Simulator 

FSL-Simulator project contains simulate match and simulate ball api's. The simulate ball api can be used to simulate each ball and to simulate entire match you can use simulate match api which require only one parameter in body i.e match_id.
Now open the FSL-Simulator 

```sh
cd FSL-Simulator 
```
Install all the project dependencies for FSL-MS-Simulator run below command:
 ```sh
 npm install
 ```
Now run below command to run scripts:
 
```sh
 npm start
 ```

Runs the server in the development mode.
Open [http://localhost:{PORT}](http://localhost:{PORT}) to view it in the browser.


 
 

 
 
