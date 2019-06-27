exports.run = (client, msg, args) => {

  const libs = client.fs.readdirSync("./templates/");
  let length = libs.length;
  // get a random mad lib
  let rng = Math.floor(Math.random() * length);
  // the actual mad lib
  let libPath = `./templates/${libs[rng]}`;

  let lib = client.fs.readFileSync(libPath, "utf8");

  // extract fillers from mad libs game
  let start = 0;
  var fillers = [];
  // while there are still brackets in the string
  while (lib.indexOf("[", start) > 0) {
    let begin = lib.indexOf("[", start);
    let end = lib.indexOf("]", start) + 1;
    let word = lib.substring(begin, end);
    fillers.push(word);
    start = end;
  }

  // create a new message collector
  var collector = new client.discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {time: 10000000});
  // start the collector
  msg.channel.send("Welcome to Mad Libz! Please note that only one person can control the bot at a time. Do you understand? Type \"yes\" to confirm.")
  .then(console.log("sent"))
  .catch(console.error);

  let forceEnd;
  let i = -1;
  let words = [];

  collector.on("collect", m => {
    // if the user does not confirm the game
    // if the user forces the game to end
    if (m.content === "end" || (i < 0 && m.content !== "yes")) {
      forceEnd = true;
      collector.stop();
    }
    else {
     if (i < 0) {
        i++;
        m.channel.send(`Please give a **${fillers[i].substring(1, fillers[i].length - 1)}**.`)
        .then(console.log("sent"))
        .catch(console.error);
      }
      // if the user plays as normal
      else if (i < fillers.length - 1) {
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
  collector.on("end", collected => {
    if (forceEnd) {
      msg.channel.send("Game has been quit")
      .then(console.log("quit game"))
      .catch(console.error);
    }
    else {
      let toDel;
      msg.channel.send("Okay, generating story...")
      .then(m => {
        toDel = m;
      })
      .catch(console.error);
      console.log("fillers: ", fillers);
      for (var i = 0; i < fillers.length; i++) {
        console.log("looping");
        lib = lib.replace(fillers[i], words[i]);
      }
      msg.channel.send(`Here is your story: \n ${lib}`)
      .then(m => {
        toDel.delete();
      })
      .catch(console.error);
    }
  });
}
