#!/usr/bin/groovy
@Library('github.com/fabric8io/fabric8-pipeline-library@nodejs')_

osio {
    ci {
        app = processTemplate(yamlFile=".openshift/application.yaml")
        build app: app
    }

    cd {
        app = processTemplate(yamlFile=".openshift/application.yaml")
        build app: app
        deploy app: app, env: 'stage'
        deploy app: app, env: 'run', approval: "manual"
    }
}}

