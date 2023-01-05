pipeline
{
   agent any
    stages
    {
        stage('Cloning FSL-MS-Simulator') 
        {
            steps 
            {
                sh '''
                    rm -rf FSL-MS-Simulator
                    git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-MS-Simulator.git
                    cd FSL-MS-Simulator
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
                cp /home/abhishek_shetty/service_account_key.json /var/lib/jenkins/workspace/FSL-MS-Simulator/FSL-Backend-Common/credentials/project-uat/service_account_key.json
                cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/FSL-MS-Simulator/FSL-MS-Simulator/.env
                #adding the service account file and .env files to the repo
                '''
                }
}
        stage('Building image')
        {
            steps 
            {
                sh '''
                    cp FSL-MS-Simulator/Dockerfile .
                    #cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/FSL-MS-Update-Leaderboard/.env
                    docker build -t ms-simulator:latest .
                    docker tag ms-simulator gcr.io/fsl-gaming/ms-simulator:latest
                    docker push gcr.io/fsl-gaming/ms-simulator

                '''
            }
        }
        stage('Deployment')
        {
            steps 
            {
                sh '''
                    kubectl rollout restart deployment fsl-simulator-mcr

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