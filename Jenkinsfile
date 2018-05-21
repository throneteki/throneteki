pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Use this build for deployment.')
    }

    environment {
        committerEmail = sh (
        script: 'git --no-pager show -s --format=\'%ae\'',
        returnStdout: true).trim()
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
                sh 'scp -r index.js package.json version.js server views node_modules throneteki-json-data jenkins@theironthrone.net:/var/lib/throneteki/'
                sh 'ssh jenkins@theironthrone.net mkdir -p /var/lib/throneteki/server/logs'
                sh 'ssh jenkins@theironthrone.net pm2 restart lobby'
            }
        }
    }

    post {
        failure {
            mail body: "project build error is here: ${env.BUILD_URL}" ,
            from: 'jenkins@theironthrone.net',
            replyTo: 'noreply@theironthrone.net',
            subject: 'Throneteki build failed',
            to: committerEmail
        }
    }
}