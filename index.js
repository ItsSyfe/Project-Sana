// Discord.JS Initialization
const Discord = require("discord.js");
const client = new Discord.Client();

// Extra
const { promisify } = require("util");
const logger = require("./functions/Logger");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

// Bot Client Requirements
client.config = require("./config.json");
client.logger = require("./functions/Logger");
require("./functions/functions")(client);
client.commands = new Enmap();
client.queue = new Map();

// Logger Logic
switch (client.config.loglevel) {
  case "debug":
    logger.level = "debug";
    logger.debug("Started in Debug Mode.");
    break;
  default:
    logger.level = "info";
    break;
}

const init = async () => {
  const eventsFetched = await readdir("./events/");
  client.logger.info(`Loading a total of ${eventsFetched.length} events.`);
  eventsFetched.forEach((file) => {
    const eventName = file.split(".")[0];
    client.logger.info(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });

  const cmdsFetched = await readdir("./commands/");
  client.logger.info(`Loading a total of ${cmdsFetched.length} commands.`);
  cmdsFetched.forEach((f) => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) client.logger.error(response);
  });

  client.login(client.config.token);
};

init();
