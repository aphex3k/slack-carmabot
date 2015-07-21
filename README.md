# slack-carmabot
Karma bot for Slack that keeps track of score.

## Installation

The code depends on the following node modules being installed

- async
- ws
- knex
- bookshelf
- sqlite3
- node-slackbot

All modules are available via `npm`.

`npm install --save async ws knex bookshelf sqlite3 node-slackbot`

Just start the `carmabot.js` script from the command line.

`while true; do node carmabot.js`

## Usage

Just invite the bot to the channels you like

`/invite {your bot name here}`

Then you can give or take karma like this

`ying++ and yang--`

You can give/take more than one karma by adding more + or - characters

`karma+++++`

The bot will confirm karma in the channel.