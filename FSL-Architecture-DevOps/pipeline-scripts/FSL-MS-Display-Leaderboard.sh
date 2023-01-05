pipeline
{
   agent any
    stages
    {
        stage('Cloning FSL-MS-Display-Leaderboard') 
        {
            steps 
            {
                sh '''
                    rm -rf FSL-MS-Display-Leaderboard
                    git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-MS-Display-Leaderboard.git
                    cd FSL-MS-Display-Leaderboard
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
                cp /home/abhishek_shetty/service_account_key.json /var/lib/jenkins/workspace/FSL-MS-Display-Leaderboard/FSL-Backend-Common/credentials/project-uat/service_account_key.json
                cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/FSL-MS-Display-Leaderboard/FSL-MS-Display-Leaderboard/.env
               #adding the service account file and .env files to the repo
                '''
                }
}
        stage('Building image')
        {
            steps 
            {
                sh '''
                    cp FSL-MS-Display-Leaderboard/Dockerfile .
                    #cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/FSL-MS-Update-Leaderboard/.env
                    docker build -t display-leaderboard:latest .
                    docker tag display-leaderboard gcr.io/fsl-gaming/display-leaderboard:latest
                    docker push gcr.io/fsl-gaming/display-leaderboard

                '''
            }
        }
        stage('Deployment')
        {
            steps 
            {
                sh '''
                    kubectl rollout restart deployment fsl-dsp-ldr-brd-mcr

                '''
            }
        }
        stage('Cleaning Up!!')
        {
            steps 
            {
                sh '''
                  docker image prune --filter="dangling=true" --force

                '''
            }
        }
    } 

}