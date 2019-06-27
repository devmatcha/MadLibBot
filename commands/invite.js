exports.run = (client, msg, args) => {
  msg.channel.send(new client.discord.RichEmbed()
              .setColor(client.color)
              .setTitle("Invite Link")
              .setDescription("[Invite Mad Libz bot](https://discordapp.com/oauth2/authorize?client_id=593240582088818688&scope=bot&permissions=68608)")
              .setThumbnail(msg.guild.me.user.avatarURL))
              .then(console.log("send"))
              .catch(console.error);
}
