pipeline
{
   agent any
    stages
    {
        stage('Cloning FSL-MS-Update-Leaderboard') 
        {
            steps 
            {
                sh '''
                    rm -rf FSL-MS-Update-Leaderboard
                    git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-MS-Update-Leaderboard.git
                    cd FSL-MS-Update-Leaderboard
                    git checkout development
                    git pull
                '''
            }
        }
        stage('Cloning FSL-Backend-Common.git') {
                steps {
                sh '''
                rm -rf FSL-Backend-Common
                git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-Backend-Common.git
                cd FSL-Backend-Common
                git checkout development
                git pull
                cp /home/abhishek_shetty/service_account_key.json /var/lib/jenkins/workspace/redis-listner/FSL-Backend-Common/credentials/project-uat/service_account_key.json
                cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/redis-listner/FSL-MS-Update-Leaderboard/.env
                #adding the service account file and .env files to the repo
                '''
                }
}
        stage('Building image')
        {
            steps 
            {
                sh '''
                    cp FSL-MS-Update-Leaderboard/Dockerfile.updateRedisListener .
                    ls -a
                    docker build -t redislistner:latest -f Dockerfile.updateRedisListener .
                    docker tag redislistner gcr.io/fsl-gaming/redislistner:latest
                    docker push gcr.io/fsl-gaming/redislistner
                '''
            }
        }
        stage('Deployment')
        {
            steps 
            {
                sh '''
                   kubectl rollout restart deployment redis-listener
                '''
            }
        }
        stage('Cleaning Up!!')
        {
            steps 
            {
                sh '''
                docker rmi gcr.io/fsl-gaming/redislistner redislistner
                 docker image prune --filter="dangling=true" --force
                '''
            }
        }
    } 

}