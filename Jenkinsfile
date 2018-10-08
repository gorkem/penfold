#!/usr/bin/groovy
@Library('github.com/fabric8io/osio-pipeline@master')_
osio {
    config runtime: 'node'

    ci {
        def app = processTemplate(
          params: [ release_version: "1.0.${env.BUILD_NUMBER}" ]
        )
        build resources: app
    }

    cd {
        def app = processTemplate(
          params: [ release_version: "1.0.${env.BUILD_NUMBER}" ]
        )
        build resources: app
        def service = loadResources(file: './.openshiftio/service.yaml')
        deploy resources: [app, service], env: 'stage'
    }
}
