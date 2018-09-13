#!/usr/bin/groovy
@Library('github.com/gorkem/osio-pipeline@master')_
osio {
    config runtime: 'node'

    ci {
        app = processTemplate()
        build app: app
    }

    cd {
        app = processTemplate()
        build app: app
        deploy app: app, env: 'stage'
        deploy app: app, env: 'run', approval: "manual"
    }
}
