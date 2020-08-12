exports.run = async (client, message, args, serverQueue) => {
  message.delete();
  client.skipSong(message, serverQueue);
};

exports.cfg = {
  name: "skip",
};
