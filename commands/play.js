exports.run = async (client, message, args, serverQueue) => {
  message.delete();
  client.getSong(message, serverQueue);
};

exports.cfg = {
  name: "play",
};
