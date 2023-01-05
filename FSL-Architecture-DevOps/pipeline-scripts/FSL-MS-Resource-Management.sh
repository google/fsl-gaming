pipeline 
{
    agent any
    stages 
    {
        stage('Cloning FSL-MS-Resource-Management git') 
        {
            steps {
                    sh '''
                    rm -rf FSL-MS-Resource-Management
                    git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-MS-Resource-Management.git
                    cd FSL-MS-Resource-Management
                    git checkout development
                    git pull
                    '''
                }
        }
        stage('Cloning FSL-Backend-Common.git') 
        {
            steps 
            {
                sh '''
                rm -rf FSL-Backend-Common
                git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-Backend-Common.git
                cd FSL-Backend-Common
                git checkout development
                git pull
                cp /home/abhishek_shetty/service_account_key.json /var/lib/jenkins/workspace/FSL-MS-Resource-Management/FSL-Backend-Common/credentials/project-uat/service_account_key.json
                cp /home/abhishek_shetty/.env /var/lib/jenkins/workspace/FSL-MS-Resource-Management/FSL-MS-Resource-Management/.env
                #adding the service account file and .env files to the repo
                '''
            }
        }
        stage('Building Image') 
        {
            steps 
            {
                sh ''' 
                cp FSL-MS-Resource-Management/Dockerfile .
                docker build -t resource_management:latest .
                docker tag resource_management gcr.io/fsl-gaming/resource_management:latest
                docker push gcr.io/fsl-gaming/resource_management
                '''
            }
        }
        stage('Deployment') 
        {
            steps 
            {
                sh ''' 
                kubectl rollout restart deployment fsl-mcr
                '''
            }
        }
        stage('Cleaning Up') 
        {
            steps {
                sh ''' 
                docker image prune --filter="dangling=true" --force
                '''
            }
        }


    }
}