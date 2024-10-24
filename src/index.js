const axios = require('axios'); // Използваме axios за HTTP заявки
const { distubeOptions } = require('./config/config.js');
const fs = require('fs');
const path = require('path');
const DisTube = require('distube');
const connectDB = require('./database');
const PlayerManager = require('./player/PlayerManager');
const { printWatermark } = require('./config/type.js');
require('dotenv').config(); // Зарежда .env файла, ако съществува

// Свързване към базата данни
connectDB();
printWatermark();

// Колекции за команди
const commands = new Map(); // Вместо client.commands
const playerManager = new PlayerManager(null, distubeOptions); // playerManager не е зависим от клиента

// Зареждане на команди
const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command && command.data && command.data.name) { // Проверка за валидни команди
    commands.set(command.data.name, command);
  }
}

// Зареждане на събития
const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event && event.name) { // Проверка за валидни събития
    // Тук можеш да добавиш логика за събития, ако имаш нужда
  }
}

// Функция за изпращане на съобщение в канал
const sendMessage = async (channelId, content) => {
  try {
    await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      { content },
      {
        headers: {
          'Authorization': `Bot ${process.env.TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent!');
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error);
  }
};

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

// Пример за изпращане на съобщение (замени с реален канал)
const exampleChannelId = 'YOUR_CHANNEL_ID'; // Замени с ID на канала
sendMessage(exampleChannelId, 'Hello from my bot!');
