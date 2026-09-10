pipeline {
    agent any

    environment {
        DOCKER_HOST = 'npipe:////./pipe/dockerDesktopLinuxEngine'
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
                echo 'Checking Docker and Java versions on Windows...'
                bat 'docker --version'
                bat 'docker compose version'
            }
        }



        stage('SonarQube Code Analysis') {
            steps {
                echo 'Running SonarQube Code Quality & Security Analysis...'
                dir('backend/matching-service') {
                    bat 'call mvnw.cmd compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || call mvn compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || rem'
                }
                dir('backend/user-service') {
                    bat 'call mvnw.cmd compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || call mvn compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || rem'
                }
                dir('backend/vacancy-service') {
                    bat 'call mvnw.cmd compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || call mvn compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -DskipTests || rem'
                }
            }
        }

       stage('Build & Deploy with Docker Compose') {
            steps {
                echo 'Building Docker images sequentially to ensure network stability...'
                bat 'docker compose down --remove-orphans || exit 0'
                bat 'docker rm -f skillnet-mysql skillnet-phpmyadmin skillnet-user-service skillnet-vacancy-service skillnet-matching-service skillnet-frontend || exit 0'
                bat 'docker compose build frontend'
                bat 'docker compose build user-service'
                bat 'docker compose build vacancy-service'
                bat 'docker compose build matching-service'
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
            echo 'SonarQube:  http://localhost:9000'
            echo 'User Service: http://localhost:8081'
            echo 'Vacancy Service: http://localhost:8082'
            echo 'Matching Service: internal 8083 (via frontend /api)'
            echo '====================================================='
        }
        failure {
            echo 'Pipeline encountered an error. Printing container logs...'
            bat 'docker compose logs --tail=50 || rem'
        }
    }
}


