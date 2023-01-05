pipeline
{
   agent any
    stages
    {
        stage('Cloning git') 
        {
            steps 
            {
                sh '''
                    rm -rf FSL-Tools
                   git clone git@gitlab.niveussolutions.com:fsl-gaming/fsl-gaming/FSL-Tools.git
                    cd FSL-Tools
                    git checkout devOps
                    git pull
                '''
            }
        }
        stage('Apllying Changes')
        {
            steps 
            {
                sh '''
                    cd FSL-Tools/locust
                    kubectl apply -f master-deployment.yaml
                    kubectl apply -f ${script_name}.yaml 
                    kubectl apply -f slave-deployment.yaml
                    kubectl rollout restart deployment locust-master
                    kubectl rollout restart deployment locust-worker
                '''
            }
        }
    } 

}