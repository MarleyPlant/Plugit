const discord = require("discord.js");
const youtube = require("ytdl-core");
let queue = {};
let dispatchers = {};

function playSong(song, msg) {
  if (song === undefined)
    return msg.channel
      .send(
        `Add some songs to the queue first with **${process.env.prefix}add**`
      )
      .then(() => {
        queue[msg.guild.id].playing = false;
        return;
      });

  msg.channel.send(
    `Playing: **${song.title}** as requested by: **${song.requestedBy}**`
  );
  dispatchers[msg.guild.id].play(youtube(song.url, { audioonly: true, quality: 'lowest' }), { passes : 0 });
  dispatchers[msg.guild.id].on('end', () => {
    playSong(queue[msg.guild.id].songs.shift(), msg);
  });
}

function validateYouTubeUrl(url) {
  if (url != undefined || url != "") {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = {
  commands: {
    join: {
      name: "join",
      parameters: {
        params: "",
        required: false,
      },
      main: function (bot, db, msg) {
        return new Promise((resolve, reject) => {
          const voiceChannel = msg.member.voice.channel;

          if   (!voiceChannel) {
            msg.channel.send("I couldn't connect to your voice channel...");
          } else {
            voiceChannel
              .join()
              .then((connection) => {
                dispatchers[msg.guild.id] = connection;
                resolve(connection);
              })
              .catch((err) => msg.channel.send(err));
            msg.channel.send(
              `Successfully Joined Channel: **${voiceChannel.name}**`
            );
          }
        });
      },
      help: "Join Bot To Current VoiceChannel",
    },

    add: {
      name: "add",
      parameters: {
        params: "(url)",
        required: true,
      },
      help: "Add a song to the queue",
      main: function (bot, db, msg) {
        args = msg.content.split(" ");
        url = args[1];

        if (url == " " || url == undefined) {
          msg.channel.send("Missing Or Invalid URL!");
          return;
        }


        if (!validateYouTubeUrl(url)) {
          return msg.channel.send("${msg.author}, The url you provided is Invalid.")
        }

        youtube.getInfo(url, (err, info) => {
          if (err) {
            msg.channel.send("An Error Has Accured: " + err);
            return;
          }

          if (!queue.hasOwnProperty(msg.guild.id)) {
            queue[msg.guild.id] = {};
            queue[msg.guild.id].playing = false;
            queue[msg.guild.id].songs = [];
          }

          queue[msg.guild.id].songs.push({
            url: url,
            title: info.videoDetails.title,
            requestedBy: msg.author.username,
          });
          msg.channel.send(`Added **${info.videoDetails.title}** to the queue!`);
        });
      },
    },

    queue: {
      name: "queue",
      parameters: {
        params: "",
        required: false,
      },
      help: "List current songs in the queue",
      main: function (bot, db, msg) {
        const embed = new discord.MessageEmbed()
          .setColor(msg.member.displayColor)
          .setTitle("Current Queue:")
          .setFooter("Requested By: " + msg.member.displayName);

        if (queue[msg.guild.id] == undefined) {
          msg.channel.send("Add some songs first.");
          return;
        }

        queue[msg.guild.id].songs.forEach(function (song, index, array) {
          embed.addField(index + 1, song.title);
        });

        msg.channel.send({ embed });
      },
    },

    play: {
      name: "play",
      parameters: {
        params: "",
        required: false,
      },
      help: "play",
      main: function (bot, db, msg) {
        if (queue[msg.guild.id] === undefined) {
          msg.channel.send(
            `Add some songs to the queue first with **${process.env.prefix}add**`
          );
          return;
        }

        if (queue[msg.guild.id].playing) {
          msg.channel.send("Already Playing");
          return;
        }

        if (msg.member.voice.channel) {
          queue[msg.guild.id].playing = true;
          playSong(queue[msg.guild.id].songs.shift(), msg);
        }
      },
    },

    skip: {
      name: "skip",
      parameters: {
        params: "",
        required: false,
      },
      help: "Skip to next song in the queue",
      main: function (bot, db, msg) {
        dispatchers[msg.guild.id].end("Skipped Song");
      },
    },

    stop: {
      name: "stop",
      parameters: {
        params: "",
        required: false,
      },
      help: "Stop Music Functionality",
      main: function (bot, db, msg) {
        msg.member.voice.channel.leave();
      },
    },

    pause: {
      name: "pause",
      parameters: {
        params: "",
        required: false,
      },
      help: "Pause the current song",
      main: function (bot, db, msg) {
        dispatchers[msg.guild.id].pause();
      },
    },

    resume: {
      name: "resume",
      parameters: {
        params: "",
        required: false,
      },
      help: "resume playback of song",
      main: function (bot, db, msg) {
        dispatchers[msg.guild.id].resume();
      },
    },
  },

  events: {},
};
