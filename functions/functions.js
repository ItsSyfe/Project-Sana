const ytdl = require("ytdl-core");
const Discord = require("discord.js");

module.exports = (client) => {
  client.embedCreator = (channel, message, deleteInTime, thumbnailImage) => {
    try {
      if (!thumbnailImage.length) thumbnailImage = null;
    } catch (e) {
      thumbnailImage = null;
    }

    const embedCreated = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setAuthor(
        "Sana",
        client.user.avatarURL(),
        "https://github.com/ItsSyfe/Project-Sana"
      )
      .setDescription(message)
      .setThumbnail(thumbnailImage)
      .setTimestamp()
      .setFooter(
        "Made by Syfe with love",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png"
      );

    if (deleteInTime != 0) {
      channel.send(embedCreated).then((msg) => {
        msg.delete({ timeout: deleteInTime * 1000 });
      });
    } else {
      channel.send(embedCreated);
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(
        client.token,
        "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
      );

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.cfg.name, props);
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.getSong = async (message, serverQueue) => {
    const args = message.content.split(" ");

    if (!args[1])
      return client.embedCreator(message.channel, "Please provide a URL!", 5);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return client.embedCreator(
        message.channel,
        "You need to be in a voice channel to play music!",
        5
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return client.embedCreator(
        message.channel,
        "I need the permissions to join and speak in your voice channel!",
        5
      );
    }
    try {
      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail:
          songInfo.videoDetails.thumbnail.thumbnails[
            songInfo.videoDetails.thumbnail.thumbnails.length - 1
          ].url,
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        client.queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          client.playSong(message.guild, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          client.queue.delete(message.guild.id);
          return client.embedCreator(message.channel, err, 5);
        }
      } else {
        serverQueue.songs.push(song);
        return client.embedCreator(
          message.channel,
          `**${song.title}** has been added to the queue!`,
          5,
          song.thumbnail
        );
      }
    } catch {
      return client.embedCreator(message.channel, "Please provide a URL!", 5);
    }
  };

  client.skipSong = (message, serverQueue) => {
    if (!message.member.voice.channel)
      return client.embedCreator(
        message.channel,
        "You have to be in a voice channel to stop the music!",
        5
      );
    if (!serverQueue)
      return client.embedCreator(
        message.channel,
        "There is no song that I could skip!",
        5
      );
    serverQueue.connection.dispatcher.end();
  };

  client.playSong = (guild, song) => {
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      client.queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        client.playSong(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    client.embedCreator(
      serverQueue.textChannel,
      `Now Playing: **${song.title}**`,
      5,
      song.thumbnail
    );
  };

  client.stopSong = (message, serverQueue) => {
    if (!message.member.voice.channel) {
      return client.embedCreator(
        message.channel,
        "You have to be in a voice channel to stop the music!",
        5
      );
    }
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    client.embedCreator(
      message.channel,
      "Cleared queue and leaving channel!",
      5
    );
  };
};
