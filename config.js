module.exports = {
    slack_token: "my-slack-token",
    channel_to_post_output_into: "#general", //channel you want the bot to post output to. Should be the same as the channel it joined
    ignore_modules: ['fs','child_process','exec','os', 'cluster', 'http', 'https', 'net'] //modules to refuse to load
}