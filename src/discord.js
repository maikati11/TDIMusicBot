// discord.js

const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config(); // Зарежда .env файла, ако съществува

// Създаване на нов Discord клиент с необходимите интенти
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Колекция за командите
client.commands = new Collection();

// Експортиране на клиента, за да може да се използва в други файлове
module.exports = client;
