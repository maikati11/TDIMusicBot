const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { distubeOptions } = require('./config/config.js');
const fs = require('fs');
const path = require('path');
const DisTube = require('distube');
const connectDB = require('./database');
const PlayerManager = require('./player/PlayerManager');
const { printWatermark } = require('./config/type.js');
require('dotenv').config(); // Добави това, за да заредиш .env файла

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

connectDB();
printWatermark();

client.commands = new Collection();
client.playerManager = new PlayerManager(client, distubeOptions);
client.playerManager.distube.setMaxListeners(20);

const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command && command.data && command.data.name) { // Проверка за валидни команди
    client.commands.set(command.data.name, command);
  }
}

const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const imagePath = path.join(__dirname, 'index.html');
    res.sendFile(imagePath);
});

app.listen(port, () => {
    console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});

// Логване на Discord бота
client.login(process.env.TOKEN).catch(err => {
  console.error("Failed to login: ", err);
});
