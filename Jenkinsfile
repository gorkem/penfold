#!/usr/bin/groovy
@Library('github.com/fabric8io/osio-pipeline@master')_
osio {
    config runtime: 'node'

    ci {
        app = processTemplate()
        build resources: app
    }

    cd {
        app = processTemplate()
        build resources: app
        deploy resources: app, env: 'stage'
        deploy resources: app, env: 'run', approval: "manual"
    }
}
