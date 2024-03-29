pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Use this build for deployment.')
        booleanParam(name: 'DEV_DEPLOY', defaultValue: false, description: 'Use this build for deployment to the development environment.')
    }

    environment {
        GIT_EMAIL = sh (script: 'git --no-pager show -s --format=\'%ae\'', returnStdout: true).trim()
        GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
        GIT_NAME = sh (script: 'git --no-pager show -s --format=\'%an\'', returnStdout: true).trim()
        DEPLOY_PATH = '/var/lib/throneteki'
        INSTANCE_NAME = 'lobby'
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

        stage('Build') {
            steps {
                sh 'npm run build-vendor'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY == true || params.DEV_DEPLOY == true }
            }
            steps {
                script {
                    if( params.DEV_DEPLOY == true ){
                        DEPLOY_PATH="${DEPLOY_PATH}-dev"
                        INSTANCE_NAME='lobby-dev'
                    }
                }

                sh "scp assets.json vendor-assets.json jenkins@theironthrone.net:${DEPLOY_PATH}/public"
                sh "scp assets.json vendor-assets.json jenkins@theironthrone.net:${DEPLOY_PATH}/"
                sh "ssh jenkins@theironthrone.net mkdir -p ${DEPLOY_PATH}/public"
                sh "scp dist/*.js dist/*.map dist/*.css dist/*.ttf jenkins@theironthrone.net:${DEPLOY_PATH}/public"
                sh "scp -r assets/* jenkins@theironthrone.net:${DEPLOY_PATH}/public"
                sh "ssh jenkins@theironthrone.net pm2 restart ${INSTANCE_NAME}"
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