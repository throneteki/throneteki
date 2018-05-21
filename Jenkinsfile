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

        stage('Build') {
            sh 'npm run build-vendor'
            sh 'npm run build'
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh 'scp assets.json vendor-assets.json jenkins@theironthrone.net:/var/lib/throneteki/'
                sh 'scp dist/*.js dist/*.map dist/*.css dist/*.ttf jenkins@theironthrone.net:/var/lib/throneteki/public'
                sh 'scp -r assets jenkins@theironthrone.net:/var/lib/throneteki/public'
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