exports.run = (client, msg, args) => {
  msg.channel.send(new client.discord.RichEmbed()
                    .setColor(client.color)
                    .setTitle("Mad Libz Help")
                    .addField("`=start`", "Start a game of Mad Libs.\nNote that only one person can control the bot at a time.")
                    .addField("`=invite`", "Sends an invite link to add the bot to other servers."));
}
