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

        stage('Build') {
            steps {
                sh 'npm run build-vendor'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh 'scp assets.json vendor-assets.json jenkins@theironthrone.net:/var/lib/throneteki/public'
                sh 'ssh jenkins@theironthrone.net mkdir -p /var/lib/throneteki/public'
                sh 'scp dist/*.js dist/*.map dist/*.css dist/*.ttf jenkins@theironthrone.net:/var/lib/throneteki/public'
                sh 'scp -r assets/* jenkins@theironthrone.net:/var/lib/throneteki/public'
                sh 'ssh jenkins@theironthrone.net pm2 restart lobby'
            }
        }
    }

    post {
        success {
            script {
                previousBuild = currentBuild.getPreviousBuild()
                if(previousBuild && !previousBuild.result.toString().equals('SUCCESS')) {
                    mail body: "Hello ${GIT_NAME},\n\nI'm please to report that the throneteki-client build is now working again.  Please find details of the build here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
                    from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
                    replyTo: 'noreply@theironthrone.net',
                    subject: "Throneteki-client build #${env.BUILD_NUMBER} fixed (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
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

            mail body: "Hello ${GIT_NAME},\n\nI'm sorry to report that the throneteki-client build is ${BUILD_STATUS}.  Please see details of the breakage here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
            from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
            replyTo: 'noreply@theironthrone.net',
            subject: "Throneteki-client build #${env.BUILD_NUMBER} ${BUILD_STATUS} (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
            to: GIT_EMAIL
        }
    }
}