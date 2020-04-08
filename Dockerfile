FROM node:12.10.0-buster-slim

ENV USER=peter
ENV SUBDIR=pubsub
RUN useradd --user-group --create-home --shell /bin/false $USER
ENV HOME=/home/$USER

COPY package.json tsconfig.json $HOME/$SUBDIR/

RUN chown -R $USER:$USER $HOME/*

USER $USER

WORKDIR $HOME/$SUBDIR

RUN npm install

CMD ["node", "dist/index.js"]