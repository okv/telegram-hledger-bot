# telegram hledger bot

Expenses tracking bot that adds transactions to your
[hledger web](https://hledger.org/hledger-web.html) instance.


[![Build Status](https://travis-ci.org/okv/telegram-hledger-bot.svg?branch=main)](https://travis-ci.org/okv/telegram-hledger-bot)
[![Coverage Status](https://coveralls.io/repos/github/okv/telegram-hledger-bot/badge.svg?branch=main)](https://coveralls.io/github/okv/telegram-hledger-bot?branch=main)

In order to add transactions to hledger this service uses
[hledger json api](https://hledger.org/hledger-web.html#json-api). Because
of hledger api implementation details this sevice is compatible with
**specific versions of hledger web** currently supported version is **1.19.1**.


**...current status is WORK IN PROGRESS, so broken changes might happen...**


## Configuration

Service could be configured using environment variables:

* **THB_HOST**: string -- host to listen, the default value is "0.0.0.0"
* **THB_PORT**: string -- port to listen, the default value is "3000"
* **THB_BOT_API_BASE_PATH**: string -- telegram api base url, the default value
is "https://api.telegram.org"
* **THB_BOT_TOKEN**: string -- your bot token, this is a **required** parameter
* **THB_BOT_WEBHOOK_PATH**: string -- if it's set (e.g. to
"/telegram/webhook/somesecret") then the bot will start in hook mode, pooling
mode will be used otherwise
* **THB_HLEDGER_BASE_PATH**: string -- hledger web base url, the default value
is "http://127.0.0.1:5000"
* **THB_DEFAULT_SECOND_ACCOUNT**: string -- this account will be used if
second account isn't set in the message, the default value is "Assets"
* **THB_FIRST_ACCOUNT_PARENT**: string -- if this option is set then it will
be added before the account in the message (e.g. if you set this to "Expenses"
and send message "10 Food" then amount 10 will be added to account
"Expenses:Food")
* **THB_CAPITALIZE_ACCOUNT**: boolean -- if this is set to `true` then the
first and the second accounts from the message will be capitalized ("food" ->
"Food"), the default value is `false`


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
