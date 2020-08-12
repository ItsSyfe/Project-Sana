exports.run = async (client, message, args, serverQueue) => {
  message.delete();
  try {
    var allSongNames = "**Songs in queue:**\n";
    serverQueue.songs.forEach((song) => {
      allSongNames += `${song.title}\n<${song.url}>\n\n`;
    });
    client.embedCreator(message.channel, allSongNames, 0);
  } catch {
    client.embedCreator(
      message.channel,
      "Please play a song for a queue to exist!",
      0
    );
  }
};

exports.cfg = {
  name: "queue",
};
