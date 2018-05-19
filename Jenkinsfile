pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Use this build for deployment.')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'node -v'
                sh 'npm prune'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh 'scp -r . jenkins@ipng.org.uk:/var/lib/throneteki/'
            }
        }
    }

    post {
        failure {
            echo 'It failed :('
                // mail body: "project build error is here: ${env.BUILD_URL}" ,
                // from: 'xxxx@yyyy.com',
                // replyTo: 'yyyy@yyyy.com',
                // subject: 'project build failed',
                // to: 'zzzz@yyyyy.com'
        }
    }
}