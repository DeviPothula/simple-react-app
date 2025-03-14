pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_URL = '148761656970.dkr.ecr.ap-south-1.amazonaws.com'
        ECR_REPO = '148761656970.dkr.ecr.ap-south-1.amazonaws.com/react-app-namespace/react-app'
        CLUSTER_NAME = 'React-App'
        BUILD_NUMBER = "${env.BUILD_NUMBER}" // Jenkins build number
    }
    stages {
        stage('Clone Repository') {
            steps {
                // Checkout the code from GitHub
                git branch: 'main', url: 'https://github.com/DeviPothula/simple-react-app-for-kubernets.git'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    // Login to AWS ECR using withAWS
                    withAWS(credentials: 'IAM-USER-CRED') {
                        sh '''
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL
                        '''
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh '''
                    docker build -t react-app-namespace/react-app .
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    // Tag the Docker image with the ECR repository URL and build number
                    sh '''
                    docker tag react-app-namespace/react-app:latest $ECR_REPO:latest
                    docker tag react-app-namespace/react-app:latest $ECR_REPO:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    // Push both the latest and build number tags to AWS ECR
                    withAWS(credentials: 'IAM-USER-CRED') {
                        sh '''
                        docker push $ECR_REPO:latest
                        docker push $ECR_REPO:$BUILD_NUMBER
                        '''
                    }
                }
            }
        }

        stage('Update EKS Deployment') {
            steps {
                script {
                    // Update kubeconfig to access the EKS cluster
                    withAWS(credentials: 'IAM-USER-CRED') {
                        sh '''
                        aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
                        kubectl apply -f ingres-def.yaml
                        kubectl apply -f react-app-deploy.yaml
                        kubectl apply -f react-app-service.yaml
                        kubectl rollout restart deployment/react-app
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            // Clean the workspace after the build
            cleanWs()
            emailext(
                subject: "Jenkins Build: ${currentBuild.fullDisplayName}",
                body: """<p>Build Details:</p>
                         <ul>
                           <li>Status: ${currentBuild.currentResult}</li>
                           <li>Project: ${env.JOB_NAME}</li>
                           <li>Build Number: ${BUILD_NUMBER}</li>
                           <li>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
                         </ul>""",
                to: "devikapothula597@gmail.com",
                mimeType: 'text/html'
            )
        }

        success {
            // Echo a success message after successful build
            echo "Build and Deployment completed successfully with image tags: $ECR_REPO:latest and $ECR_REPO:$BUILD_NUMBER"
        }

        failure {
            // Handle failure case if needed (optional)
            echo 'Build failed. Please check the logs for errors.'
        }
    }
}
