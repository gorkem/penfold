# penfold

penfold is a chat bot to assist the daily activities of a development team that is 
 built on the [Hubot][hubot] framework. 

[hubot]: http://hubot.github.com

### Running penfold Locally

You can start penfold locally by running:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    penfold>

Then you can interact with penfold by typing `penfold help`.

    penfold> penfold help
    penfold standup -- Display latest reports from the team members
    penfold standup <standup report> -- record daily standup
    ...

### Configuration
Requires some environment variables to be set to work. See [penfold.ts](./penfold.ts) for configuration information. 

When running locally setting `MONGODB_HOST` should be enough depending on the configuration for your local mongo installation.

Example using docker based mongodb:

```
docker run -p 27017:27017 -d mongo
export MONGODB_HOST=localhost
bin/hubot
```

Also notice the environment variables required by the adapter. By default penfold uses mattermost and the configuration information for mattermost adapter can be found in [here](https://github.com/loafoe/hubot-matteruser#environment-variables)

### Deploying on Openshift/Kubernetes

Deployment requires [kedge](http://kedgeproject.org/) tool. See kedge project for getting started.

Before running the project correct the values on `configmap.k.yml` and `penfold.k.yml` to be compatible with your environment.

Use `oc` or  `kubectl` to connect to your cluster and create a project. 

Run the following command to create necessary files

    cd kedge
    kedge apply -f pvc.k.yml -f secret.k.yml -f configmap.k.yml -f mongodb.k.yml -f penfold.k.yml  

