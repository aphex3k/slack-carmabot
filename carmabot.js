/**
 * Created by micha on 7/20/15.
 */

var slackbot = require('node-slackbot');

var sqlite = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./carmabot.sqlite"
    }
});

var bookshelf = require('bookshelf')(sqlite);

bookshelf.knex.schema.hasTable('carma').then(function(exists) {
    if(!exists) {
        bookshelf.knex.schema.createTable('carma', function(t) {
            t.string('target').primary();
            t.integer('score');
        }).then(function(table){
            console.log('Created Table:', 'carma');
        });
    }
}).then(function () {

    function processText (message, newText)
    {
        if (message == null || newText == null || newText.length < 3)
            return;

        const pattern = /\S+[\++|\-+]/gi

        var matches = newText.match(pattern);

        if (matches != null)
        {
            var targetMatch = matches[0];

            const plusPattern = /\++/;

            var match = targetMatch.match(plusPattern);

            var isNegative = false;

            if (match == null || match.length == 0)
            {
                const minusPattern = /\-+/;

                match = targetMatch.match(minusPattern)

                isNegative = true;
            }

            if (match == null)
                return;

            var level = match[0].length;

            var target = targetMatch.substr(0, targetMatch.length - level);

            newText = newText.substr(newText.indexOf(targetMatch) + targetMatch.length);

            level--;

            if (level == 0)
                return;

            if (isNegative)
            {
                level *= -1;
            }

            console.log(level + ' carma to ' + target);

            var carma = Carma.forge({'target': target.toLowerCase()})
                .fetch()
                //.catch(function(err) {
                //    console.log('no carma found for ' + target);
                //})
                .then(function(model) {

                    if (model == null || model == 'undefined')
                    {
                        console.log('undefined');

                        Carma.forge({'target': target.toLowerCase(), 'score': level}).save(null, {method: 'insert'})
                            .then(function() {
                                var p = level > 0 ? '+' : '';

                                bot.sendMessage(message.channel, level + ' carma for ' + target + ' (' + p + level + ')');

                                processText(message, newText);
                            });
                    }
                    else
                    {
                        console.log('defined');
                        var newScore = model.get("score") + level;

                        var p = level > 0 ? '+' : '';

                        model.set({'score': newScore});
                        model.save().then(function(){
                            bot.sendMessage(message.channel, newScore + ' carma for ' + target + ' (' + p + level + ')');

                            processText(message, newText);
                        });
                    }
                });
        }
    }

    var Carma = bookshelf.Model.extend({
        tableName: 'carma',
        idAttribute: 'target',
    });

    var configuration = require('./carmabotConfiguration.js');

    var bot = new slackbot(configuration().token);

    bot.use(function(message, cb) {
        if ('message' == message.type) {

            processText(message, message.text);
        }
        cb();
    });

    bot.connect();
});