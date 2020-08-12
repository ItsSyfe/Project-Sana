exports.run = async (client, message, args, serverQueue) => {
  message.delete();
  client.stopSong(message, serverQueue);
};

exports.cfg = {
  name: "stop",
};
