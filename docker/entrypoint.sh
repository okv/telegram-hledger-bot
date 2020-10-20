#!/bin/sh

echo "*** Running telegram-hledger-bot";
cat /var/telegram-hledger-bot/dependencies-info.txt;
echo "***";
cd /var/telegram-hledger-bot && node lib/server.mjs;
