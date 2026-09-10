pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                echo 'Checking Docker and Java versions on Windows...'
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                echo 'Building Docker images and starting SkillNet containers...'
                bat 'docker compose down --remove-orphans'
                bat 'docker compose build --parallel=false'
                bat 'docker compose up -d'
            }
        }

        stage('Health Check Services') {
            steps {
                echo 'Waiting for microservices to initialize...'
                sleep 20
                script {
                    echo 'Verifying running containers...'
                    bat 'docker compose ps'
                }
            }
        }
    }

    post {
        success {
            echo '====================================================='
            echo 'SkillNet Microservices successfully built & deployed!'
            echo 'Frontend:   http://localhost:5173'
            echo 'phpMyAdmin: http://localhost:8089'
            echo 'User Service: http://localhost:8081'
            echo 'Vacancy Service: http://localhost:8082'
            echo 'Matching Service: internal 8083 (via frontend /api)'
            echo '====================================================='
        }
        failure {
            echo 'Pipeline encountered an error. Printing container logs...'
            bat 'docker compose logs --tail=50'
        }
    }
}

