FROM node:14.14.0-alpine3.10

ENV NODE_ENV="production"
ENV USER="telegram-hledger-bot"
ENV USER_ID=2000
ENV USER_GORUP_ID=2000

RUN addgroup -g "$USER_GORUP_ID" "$USER" && \
	adduser --disabled-password --ingroup "$USER" --uid "$USER_ID" "$USER";

RUN mkdir /var/telegram-hledger-bot

COPY package.json package-lock.json /var/telegram-hledger-bot/
COPY lib /var/telegram-hledger-bot/lib

RUN chown -R "$USER":"$USER" /var/telegram-hledger-bot

USER ${USER}

RUN cd /var/telegram-hledger-bot && \
	npm ci --only=prod && \

	echo "nodejs: `node --version`" >> dependencies-info.txt && \
	npmPackages=`cd /var/telegram-hledger-bot && npm ls --prod --depth=0 | tail -n +2` && \
	echo -e "npm packages:\n$npmPackages" >> dependencies-info.txt;

ADD docker/entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
