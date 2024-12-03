pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        ECR_URL= "148761656970.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPO = '148761656970.dkr.ecr.ap-south-1.amazonaws.com/react-app-namespace/react-app'
        CLUSTER_NAME = 'React-App'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
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
                    withAWS(credentials: 'AWS-CRED') {
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
                    docker build -t react-app-namespace/react-app  .
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    // Tag the Docker image with the ECR repository URL
                    sh '''
                    docker tag react-app-namespace/react-app:latest $ECR_REPO:latest
                    '''
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    // Push the Docker image to AWS ECR
                    withAWS(credentials: 'AWS-CRED') {
                        sh '''
                        docker push $ECR_REPO:latest
                        '''
                    }
                }
            }
        }

        stage('Update EKS Deployment') {
            steps {
                script {
                    // Update kubeconfig to access the EKS cluster
                    withAWS(credentials: 'AWS-CRED') {
                        sh '''
                        aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
                         kubectl set image deployment/react-app react-app=148761656970.dkr.ecr.ap-south-1.amazonaws.com/react-app-namespace/react-app:latest --record
                         kubectl apply -f ingres-def.yaml
                         kubectl apply -f react-app-deploy.yaml
                         kubectl apply -f react-app-service.yaml
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
        }
        
        success {
            // Echo a success message after successful build
            echo "Build and Deployment completed successfully with image tag: $ECR_REPO:$BUILD_NUMBER"
        }

        failure {
            // Handle failure case if needed (optional)
            echo "Build failed. Please check the logs for errors."
        }
    }
}