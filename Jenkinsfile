pipeline {
  agent label:'hca-testing'
  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm install'
        // Sigh. https://github.com/sass/node-sass/issues/1579
        sh 'npm rebuild node-sass'
        sh 'npm run webpack-prod'
        sh 'PHANTOMJS_BIN=/bin/phantomjs npm test'
      }
    }
  }
}
