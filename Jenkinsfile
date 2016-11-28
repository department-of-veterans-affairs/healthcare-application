pipeline {
  agent label:'hca-linting'
  stages {
    stage('Checkout Code') {
      checkout scm
    }

    stage('Run tests') {
      sh 'npm install'
      # Sigh. https://github.com/sass/node-sass/issues/1579
      sh 'npm rebuild node-sass'
      sh 'npm run webpack-prod'
    }
  }
}
