var Botkit = require('botkit');
var config = require('./config');

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

const deentitize = function(str) {
    var ret = str.replace(/&gt;/g, '>');
    ret = ret.replace(/&lt;/g, '<');
    ret = ret.replace(/&quot;/g, '"');
    ret = ret.replace(/&apos;/g, "'");
    ret = ret.replace(/&amp;/g, '&');
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
    switch(message.text) {
        case '*reset':
            child.kill();
            break;
        default:
            const exp = deentitize(message.text)
                .replace(/\r?\n|\r/g,'')
                .replace(/”/g, '"')
                .replace(/“/g, '"')
                .replace(/`/g, "'")
                .replace(/’/g,"'")
                .replace(/‘/g, "'");

            console.log('evaluating '+exp);
            try {
                child.stdin.write(exp+"\n");
            } catch(e) {
                console.log(e);
                bot.reply(message, e.message);
            }
    }
})