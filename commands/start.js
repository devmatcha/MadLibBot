exports.run = (client, msg, args) => {

  msg.channel.send("Retrieving a mad lib...")
  .then(console.log("sent"))
  .catch(console.error);

  const libs = client.fs.readdirSync("./templates/");
  let length = libs.length;
  // get a random mad lib
  let rng = Math.floor(Math.random() * length);
  // the actual mad lib
  let libPath = `./templates/${libs[rng]}`;

  let lib = client.fs.readFileSync(libPath);

  console.log(typeof(lib));


  msg.channel.send("Retrieved a Mad Lib template.")
  .then(console.log("sent"))
  .catch(console.error);


  // extract fillers from mad libs game
  let start = 0;
  var fillers = [];
  // while there are still brackets in the string
  while (lib.indexOf("[", start) > 0) {
    let begin = lib.indexOf("[", start);
    let end = lib.indexOf("]", start) + 1;
    let word = lib.substring(start, end);
    fillers.push(word);
    start = end;
  }

  // create a new message collector
  var collector = new client.discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {time: 10000000});
  // start the collector
  msg.channel.send("Welcome to Mad Libz! Please note that only one person can control the bot at a time. Do you understand? Type \"yes\" to confirm.");

  let forceEnd;
  let i = -1;
  let words = [];

  collector.on("collect", m => {
    // if the user does not confirm the game
    // if the user forces the game to end
    if (m.content === "end") {
      m.channel.send("Game has been quit")
      .then(console.log("sent"))
      .catch(console.error);
      collector.stop();
      forceEnd = true;
    }
    else {
      if (i < 0 && m.content !== "yes") {
        m.channel.send("Game has been quit")
        .then(console.log("sent"))
        .catch(console.error);
        collector.stop();
      }
      // if the user does confirm the game
      else if (i < 0 && m.content === null) {
        i++;
        m.channel.send(`Please give a **${fillers[i].substring(1, fillers[i].length - 1)}**.`)
        .then(console.log("sent"))
        .catch(console.error);
      }
      // if the user plays as normal
      else if (i < fillers.length) {
        i++;
        words.push(m.content);
        m.channel.send(`Please give a **${fillers[i].substring(1, fillers[i].length - 1)}**.`)
        .then(console.log("sent"))
        .catch(console.error);
      }
      // if the user completes the game
      else {
        collector.stop();
        forceEnd = false;
      }
    }
  });

  // if the game finishes and the user did not force the game to end
  if (!forceEnd) {
    msg.channel.send("*Generating Mad Lib story...*")
    .then(m => {
      for (var i = 0; i < words.length; i++) {
        lib.replace(fillers[i], words[i]);
      }

      m.delete();
    })
    .catch(console.error);

    msg.channel.send(`Here is your story: \n ${lib}`)
    .then(console.log("sent"))
    .catch(console.error);
  }
}
