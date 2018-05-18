node('node') {
    currentBuild.result = "SUCCESS"

    try {
        stage('Checkout') {
            checkout scm
            sh 'node -v'
            sh 'npm prune'
            sh 'npm install'
        }

        stage('Lint') {
            sh 'npm run lint'
        }

        stage('Test') {
            sh 'npm test'
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
            // mail body: "project build error is here: ${env.BUILD_URL}" ,
            // from: 'xxxx@yyyy.com',
            // replyTo: 'yyyy@yyyy.com',
            // subject: 'project build failed',
            // to: 'zzzz@yyyyy.com'

        throw err
    }
}