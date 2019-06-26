const config = require("./config.json");
// discord
const Discord = require("discord.js");
const client = new Discord.Client();
// everything else
const fs = require("fs");
const Enmap = require("enmap");
// client variables
client.config = config;
client.commands = new Enmap();

// get each event from the events folder
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    // extract the name of the file
    let name = file.split(".")[0];
    // run the command
    client.on(name, event.bind(null, client));
  });
});

// get each command from the commands folder
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    // if the file is not a javascript file
    if (!file.endsWith(".js")) return;
    let cmd = require(`./commands/${file}`);
    let command = file.split(".")[0];
    client.commands.set(command, cmd);
  });
});

client.login(config.token);
