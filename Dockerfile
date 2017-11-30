FROM registry.centos.org/sclo/nodejs-4-centos7:latest

# Install dependencies for mattermost-integration-github
RUN git clone https://github.com/gorkem/penfold &&\
    cd penfold && git checkout 82ac02228db306af6375ca2db08f0dbde5bc3f44 &&\
    $PROMPT_COMMAND && npm install && npm run build &&\
    sed --in-place '5,6d' ./bin/hubot

WORKDIR /opt/app-root/src/penfold

CMD ./bin/hubot -a matteruser
