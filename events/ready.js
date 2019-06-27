module.exports = (client) => {
  console.log("Logged in as " + client.user.tag + "!");
  client.user.setActivity("=start to start a game");
}
