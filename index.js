var Botkit = require('botkit');
var config = require('./config');
var entities = require('html-entities');

var spawn = require('child_process').spawn;
var child = spawn('node',['-i']);


let global_bot;

const attachChildListeners = (c) => {
    c.stdin.setEncoding('utf-8');
    c.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    c.stdout.on('data', (data) => {
        console.log(data.toString().trim());
        if(global_bot && data.toString().trim() != '>' && data.toString().trim() !== 'undefined') {
            global_bot.say({
                text: data.toString(),
                channel: config.channel_to_post_output_into
            })
        }
    });
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}. Restarting...`);
        child = spawn('node',['-i']);
        attachChildListeners(child);
    });
}

attachChildListeners(child);

const token = config.slack_token;

const cleanup = function(str) {
    var ret = entities.decode(str)
        .replace(/\r?\n|\r/g,'')
        .replace(/”/g, '"')
        .replace(/“/g, '"')
        .replace(/`/g, "'")
        .replace(/’/g,"'")
        .replace(/‘/g, "'");
    return ret;
};

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
controller.spawn({
        token: token,
}).startRTM();

controller.on('hello', function(bot, data) {
    global_bot = bot;
})

controller.on('direct_mention', (bot, message) => {
    const {text} = message;
    var expstr = "require\\(('|\")("+config.ignore_modules.join('|')+")('|\")\\)";
    var exp = new RegExp(expstr, "ig");
    var messageText = cleanup(text);

    if(messageText.match(exp)) {
        bot.reply(message, "You cannot require that module!");
    } else {
        switch(messageText) {
            case '*reset':
                child.kill();
                break;
            default:
                console.log('evaluating '+messageText);
                try {
                    child.stdin.write(messageText+"\n");
                } catch(e) {
                    console.log(e);
                    bot.reply(message, e.message);
                }
        }
    }
})