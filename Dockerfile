FROM registry.centos.org/centos/nodejs-6-centos7:latest

# Install dependencies for mattermost-integration-github
RUN git clone https://github.com/gorkem/penfold &&\
    cd penfold &&\
    $PROMPT_COMMAND && npm install && npm run build &&\
    sed --in-place '5,6d' ./bin/hubot

WORKDIR /opt/app-root/src/penfold

CMD ./bin/hubot -a matteruser
