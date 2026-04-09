pipeline{
    agent any
    tools {
        nodejs "NodeJS-20"
    }

    //---Environment Variables--------------------------------
    environment {
        BASE_URL              = 'https://automationexercise.com'
        API_BASE_URL          = 'https://automationexercise.com/api'
        BROWSER               = 'chromium'
        HEADLESS              = 'true'
        SLOW_MO               = '0'
        SCREENSHOT_ON_FAILURE = 'true'
        TRACE_ON_FAILURE      = 'true'
        VIDEO_ON_FAILURE      = 'false'
        DEFAULT_TIMEOUT       = '30000'
        NAVIGATION_TIMEOUT    = '30000'

        // Sensitive values come from Jenkins credentials
        TEST_USER_EMAIL    = credentials('test-user-email')
        TEST_USER_PASSWORD = credentials('test-user-password')
        TEST_USER_NAME     = credentials('test-user-name')
    }

    //---Triggers-----------------------------------------
    triggers {
        pollSCM('H/5 * * * *') // Polls the SCM every 5 minutes
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                bat 'npx playwright install chromium'
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Running API tests...'
                bat 'node --max-old-space-size=4096 node_modules/.bin/cucumber-js --config=cucumber.api.js'
            }
            post {
                always {
                    echo 'Archiving API test results...'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'cucumber-api-report.html',
                        reportName: 'API Test Report'
                    ])
                }
            }
        }

        stage('Run UI Smoke Tests') {
            steps {
                echo 'Running UI tests...'
                bat 'node --max-old-space-size=4096 node_modules/.bin/cucumber-js --config=cucumber.ui.js --tags "@smoke"'
            }   
            post {
                always {
                    echo 'Archiving UI test results...'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'cucumber-report.html',
                        reportName: 'UI Smoke Test Report'
                    ])
                }
            }
        }

        stage('Run UI Regression Tests') {
            steps {
                echo 'Running UI regression tests...'
                bat 'node --max-old-space-size=4096 node_modules/.bin/cucumber-js --config=cucumber.ui.js --tags "@regression"'
            }   
            post {
                always {
                    echo 'Archiving UI regression test results...'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'cucumber-report.html',
                        reportName: 'UI Regression Test Report'
                    ])
                }
            }
        }

        post {
            always {
                echo 'Archiving test artifacts...'
                // Archive screenshots and traces
                archiveArtifacts(
                    artifacts: 'reports/screenshots/**/*.png, reports/traces/**/*.zip',
                    allowEmptyArchive: true
                )
            }

            success {
                echo 'All tests passed successfully!'
                emailext(
                    subject: "BUILD PASSED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2>Build Passed</h2>
                        <p><b>Job:</b> ${env.JOB_NAME}</p>
                        <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                        <p><b>Duration:</b> ${currentBuild.durationString}</p>
                        <p><a href="${env.BUILD_URL}">View Build</a></p>
                    """,
                    mimeType: 'text/html',
                    to: TEST_USER_EMAIL
                )
            }   

            failure {
                echo 'Build failed!. Please check the reports for details.'
                emailext(
                    subject: "BUILD FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2>Build Failed</h2>
                        <p><b>Job:</b> ${env.JOB_NAME}</p>
                        <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                        <p><b>Failed Stage:</b> ${env.STAGE_NAME}</p>
                        <p><a href="${env.BUILD_URL}">View Build</a></p>
                        <p><a href="${env.BUILD_URL}artifact/reports/screenshots/">View Screenshots</a></p>
                    """,
                    mimeType: 'text/html',
                    to: TEST_USER_EMAIL
                )
            }

            cleanup {
                echo 'Cleaning up workspace...'
                cleanWs()
            }
        }
    }
}