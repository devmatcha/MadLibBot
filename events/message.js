module.exports = (client, msg) => {
  const prefix = client.config.prefix;

  // ignore bots
  if (msg.author.bot) return;

  // ignore messages that don't have a prefix
  if (msg.content.indexOf(prefix) !== 0) return;

  // extract args from the message
  const args = msg.content.slice(1).trim().split(/ +/g);
  const cmd = client.commands.get(args.shift().toLowerCase());

  // if the given command is not valid
  if (!cmd) return;

  cmd.run(client, msg, args);
}
