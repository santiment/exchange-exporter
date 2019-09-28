podTemplate(label: 'exchange-exporter', containers: [
  containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat', envVars: [
    envVar(key: 'DOCKER_HOST', value: 'tcp://docker-host-docker-host:2375')
  ])
]) {
  node('exchange-exporter') {
    stage('Run Tests') {
      container('docker') {
        def scmVars = checkout scm

        if (env.BRANCH_NAME == "master") {
          withCredentials([
            string(
              credentialsId: 'aws_account_id',
              variable: 'aws_account_id'
            )
          ]) {
            def awsRegistry = "${env.aws_account_id}.dkr.ecr.eu-central-1.amazonaws.com"
            docker.withRegistry("https://${awsRegistry}", "ecr:eu-central-1:ecr-credentials") {
              sh "docker build -t ${awsRegistry}/exchange-exporter:${env.BRANCH_NAME} -t ${awsRegistry}/exchange-exporter:${scmVars.GIT_COMMIT} ."
              sh "docker push ${awsRegistry}/exchange-exporter:${env.BRANCH_NAME}"
              sh "docker push ${awsRegistry}/exchange-exporter:${scmVars.GIT_COMMIT}"
            }
          }
        }
      }
    }
  }
}
