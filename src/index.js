const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { distubeOptions } = require('./config/config.js');
const fs = require('fs');
const path = require('path');
const DisTube = require('distube');
const connectDB = require('./database');
const PlayerManager = require('./player/PlayerManager');
const { printWatermark } = require('./config/type.js');
require('dotenv').config(); // Зарежда .env файла, ако съществува

// Инициализиране на Discord клиента
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Свързване към базата данни
connectDB();
printWatermark();

// Колекции за команди
client.commands = new Collection();
client.playerManager = new PlayerManager(client, distubeOptions);
client.playerManager.distube.setMaxListeners(20);

// Зареждане на команди
const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command && command.data && command.data.name) { // Проверка за валидни команди
    client.commands.set(command.data.name, command);
  }
}

// Зареждане на събития
const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event && event.name) { // Проверка за валидни събития
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// Express сървър за уеб интерфейс
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Използвай променлива за порта
app.get('/', (req, res) => {
    const imagePath = path.join(__dirname, 'index.html');
    res.sendFile(imagePath);
});

app.listen(port, () => {
    console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});

// Стартиране на Discord бота
client.login(process.env.TOKEN).catch(err => {
  console.error("Failed to login: ", err);
});
