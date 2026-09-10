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
                echo 'Checking Docker versions...'
                script {
                    if (isUnix()) {
                        sh 'docker --version'
                        sh 'docker compose version'
                    } else {
                        bat 'docker --version'
                        bat 'docker compose version'
                    }
                }
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                echo 'Building Docker images and starting SkillNet containers...'
                script {
                    if (isUnix()) {
                        sh 'docker compose down --remove-orphans || true'
                        sh 'docker compose up -d --build'
                    } else {
                        bat 'docker compose down --remove-orphans || ver >nul'
                        bat 'docker compose up -d --build'
                    }
                }
            }
        }

        stage('Health Check Services') {
            steps {
                echo 'Waiting for microservices to initialize...'
                sleep 20
                script {
                    echo 'Verifying running containers...'
                    if (isUnix()) {
                        sh 'docker compose ps'
                    } else {
                        bat 'docker compose ps'
                    }
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
            script {
                if (isUnix()) {
                    sh 'docker compose logs --tail=50'
                } else {
                    bat 'docker compose logs --tail=50'
                }
            }
        }
    }
}

