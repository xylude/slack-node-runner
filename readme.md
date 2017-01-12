#Node Slack Bot

This is a slack bot that runs node commands in the channel of your choosing.

#Setup

Set up a new bot user on Slack, then invite it to a channel.
You can read more on setting up bot users here:

https://api.slack.com/bot-users

Give your bot an API token by going into the bot settings and adding 
a API token.

Once you have the bot and token, add the token to the .env file. You can move your .env 
file to another directory if you want. Either way you'll need to set the env file's location in config.js.

Once that's done go ahead and invite the bot to the channel you want to interact with it from.

Deploy this application to a server of your choosing, once it's running 
you can interact with it by typing @your-bots-name commands followed by javascript.

NOTE: Any packages (with the exeption of ones added to the ignore_modules option in the config file) you add to package.json will be available to the node bot since it runs in the 
same context as the server. This lets you add packages that the node-bot can interact with.