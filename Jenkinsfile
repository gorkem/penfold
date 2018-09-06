#!/usr/bin/groovy
@Library('github.com/fabric8io/fabric8-pipeline-library@nodejs')_
osio {
    ci {
        app = processTemplate([release_version: "1.0.${env.BUILD_NUMBER}"])
        build app: app
    }

    cd {
        app = processTemplate([release_version: "1.0.${env.BUILD_NUMBER}"])
        build app: app
        deploy app: app, env: 'stage'
        deploy app: app, env: 'run', approval: "manual"
    }
}
