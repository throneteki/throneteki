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
                sh 'ssh jenkins@theironthrone.net rm -rf /var/lib/throneteki-previous'
                sh 'ssh jenkins@theironthrone.net mv /var/lib/throneteki /var/lib/throneteki-previous'
                sh 'scp -r index.js package.json version.js server views node_modules jenkins@theironthrone.net:/var/lib/throneteki/'
                //sh 'ssh jenkins@theironthrone.net mv /var/lib/throneteki pm2 restart throneteki'
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