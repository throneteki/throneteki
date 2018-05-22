pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Use this build for deployment.')
    }

    environment {
        GIT_EMAIL = sh (script: 'git --no-pager show -s --format=\'%ae\'', returnStdout: true).trim()
        GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
        GIT_NAME=sh (script: 'git --no-pager show -s --format=\'%an\'', returnStdout: true).trim()
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
                sh 'ssh jenkins@theironthrone.net cd /var/lib/throneteki && node server/scripts/fetchdata.js'
                sh 'ssh jenkins@theironthrone.net pm2 restart lobby'
            }
        }
    }

    post {
        success {
            script {
                previousBuild = currentBuild.getPreviousBuild()
                if(previousBuild && !previousBuild.result.toString().equals('SUCCESS')) {
                    mail body: "Hello ${GIT_NAME},\n\nI'm please to report that the throneteki build is now working again.  Please find details of the build here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
                    from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
                    replyTo: 'noreply@theironthrone.net',
                    subject: "Throneteki build #${env.BUILD_NUMBER} fixed (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
                    to: GIT_EMAIL
                }
            }
        }

        failure {
            script {
                previousBuild = currentBuild.getPreviousBuild()
                if(!previousBuild || previousBuild.result.toString().equals('SUCCESS')) {
                    BUILD_STATUS_SUBJECT='broken'
                    BUILD_STATUS='now broken'
                } else {
                    BUILD_STATUS_SUBJECT='still broken'
                    BUILD_STATUS='still broken'
                }
            }

            mail body: "Hello ${GIT_NAME},\n\nI'm sorry to report that the throneteki build is ${BUILD_STATUS}.  Please see details of the breakage here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
            from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
            replyTo: 'noreply@theironthrone.net',
            subject: "Throneteki build #${env.BUILD_NUMBER} ${BUILD_STATUS} (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
            to: GIT_EMAIL
        }
    }
}