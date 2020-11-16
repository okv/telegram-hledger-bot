# telegram hledger bot

Expenses tracking bot that adds transactions to your
[hledger web](https://hledger.org/hledger-web.html) instance.


[![Build Status](https://travis-ci.org/okv/telegram-hledger-bot.svg?branch=main)](https://travis-ci.org/okv/telegram-hledger-bot)


In order to add transactions to hledger this service uses
[hledger json api](https://hledger.org/hledger-web.html#json-api). Because
of hledger api implementation details this sevice is compatible with
**specific versions of hledger web** current supported version is **1.19.1**.


**...WIP...**


## Development

Prepare dev environment:

* `nvm install` to install/activate required version of Node.js
(described in `.nvmrc`) using [nvm](https://github.com/nvm-sh/nvm)
* `npm ci` to install project dependencies
* `npm test` to run tests

Setup hledger instance e.g. using docker:

```
> mkdir data
> touch data/all.journal
> docker run --rm -v $PWD/data:/data -p 5000:5000 --user $(id --user) dastapov/hledger:1.19.1 hledger-web --server --host=0.0.0.0 --port=5000 --file=/data/all.journal --base-url="http://localhost:5000" --debug=1 --capabilities=view,add,manage
```

Start service in development mode with any app options e.g.:

```
THB_BOT_WEBHOOK_PATH="/telegram/webhook" THB_BOT_TOKEN="mytgsecret" npm run dev
```

Now you can emulate telegram message by triggering hook e.g.:

```
curl http://127.0.0.1:3000/telegram/webhook -H 'content-type: application/json' -X POST -d '{"update_id": 12345678, "message": {"message_id": 111, "from": {"id": 222, "is_bot": false, "first_name": "John", "last_name": "Doe", "username": "john_doe", "language_code": "en"}, "chat": {"id": 333, "first_name": "Jogn", "last_name": "Doe", "username": "john_doe", "type": "private"}, "date": 1601903576, "text": "10 Food"} }'
```
