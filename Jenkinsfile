#!/usr/bin/groovy
@Library('github.com/fabric8io/fabric8-pipeline-library@nodejs')_
osio {
    config runtime: 'node'

    ci {
        app = processTemplate()
        echo app
        build app: app
    }

    cd {
        app = processTemplate()
        build app: app
        deploy app: app, env: 'stage'
        deploy app: app, env: 'run', approval: "manual"
    }
}
