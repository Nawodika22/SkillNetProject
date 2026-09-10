pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                echo 'Checking Docker and Java versions...'
                sh 'docker --version || true'
                sh 'docker compose version || true'
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                echo 'Building Docker images and starting SkillNet containers...'
                // Stop any running containers and launch with fresh build
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose up -d --build'
            }
        }

        stage('Health Check Services') {
            steps {
                echo 'Waiting for microservices to initialize...'
                sleep 20
                script {
                    echo 'Verifying running containers...'
                    sh 'docker compose ps'
                }
            }
        }
    }

    post {
        success {
            echo '====================================================='
            echo 'SkillNet Microservices successfully built & deployed!'
            echo 'Frontend: http://localhost:5173'
            echo 'User Service: http://localhost:8081'
            echo 'Vacancy Service: http://localhost:8082'
            echo 'Matching Service: http://localhost:8083'
            echo '====================================================='
        }
        failure {
            echo 'Pipeline encountered an error. Printing container logs...'
            sh 'docker compose logs --tail=50'
        }
    }
}
