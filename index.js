require('dotenv').config(); // Memuat konfigurasi dari .env
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = express();
const port = process.env.PORT || 3000; // Menggunakan PORT dari .env atau 3000 sebagai default

const WELCOME_IMAGE_URL = 'https://i.imgur.com/13IvTa6.png'; // Gambar latar belakang baru
const WELCOME_CHANNEL_ID = '1313095157477802034';
const GOODBYE_CHANNEL_ID = '1313095157477802034';

// Bot login
client.once('ready', () => {
  console.log('Bot is online!');
});

// Welcome image when a new member joins
client.on('guildMemberAdd', async (member) => {
  const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!welcomeChannel) return;

  // Create welcome image with 16:9 aspect ratio (700x393)
  const canvas = createCanvas(700, 393);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Set text style (bold and centered)
  ctx.textAlign = 'center'; // Align text to the center
  ctx.textBaseline = 'middle'; // Set baseline to middle for proper vertical centering

  // Text styling for Welcome
  ctx.font = '60px bold Arial'; // Bold and larger font
  ctx.fillStyle = 'white';
  ctx.fillText('Welcome!', canvas.width / 2, 60); // Centered 'Welcome' text

  ctx.font = '50px bold Arial'; // Bold font
  ctx.fillStyle = 'yellow';
  ctx.fillText(member.user.username, canvas.width / 2, 120); // Centered username text

  ctx.font = '40px bold Arial'; // Bold font
  ctx.fillStyle = 'white';
  ctx.fillText('Semoga betah disini!', canvas.width / 2, 180); // Centered "Semoga betah disini!" text

  // Send the image to the welcome channel
  welcomeChannel.send({
    content: `<@${member.id}>`,
    files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
  });
});

// Goodbye image when a member leaves
client.on('guildMemberRemove', async (member) => {
  const goodbyeChannel = member.guild.channels.cache.get(GOODBYE_CHANNEL_ID);
  if (!goodbyeChannel) return;

  // Create goodbye image with 16:9 aspect ratio (700x393)
  const canvas = createCanvas(700, 393);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Set text style (bold and centered)
  ctx.textAlign = 'center'; // Align text to the center
  ctx.textBaseline = 'middle'; // Set baseline to middle for proper vertical centering

  // Text styling for Goodbye
  ctx.font = '60px bold Arial'; // Bold and larger font
  ctx.fillStyle = 'white';
  ctx.fillText('Goodbye!', canvas.width / 2, 60); // Centered 'Goodbye' text

  ctx.font = '50px bold Arial'; // Bold font
  ctx.fillStyle = 'yellow';
  ctx.fillText(member.user.username, canvas.width / 2, 120); // Centered username text

  ctx.font = '40px bold Arial'; // Bold font
  ctx.fillStyle = 'white';
  ctx.fillText('Semoga sukses!', canvas.width / 2, 180); // Centered "Semoga sukses!" text

  // Send the image to the goodbye channel
  goodbyeChannel.send({
    content: `<@${member.id}>`,
    files: [{ attachment: canvas.toBuffer(), name: 'goodbye-image.png' }],
  });
});

// Command to trigger welcome image manually
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!slwelcome') {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const member = message.member;

    // Create welcome image with 16:9 aspect ratio (700x393)
    const canvas = createCanvas(700, 393);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text style (bold and centered)
    ctx.textAlign = 'center'; // Align text to the center
    ctx.textBaseline = 'middle'; // Set baseline to middle for proper vertical centering

    // Text styling for Welcome
    ctx.font = '60px bold Arial'; // Bold and larger font
    ctx.fillStyle = 'white';
    ctx.fillText('Welcome!', canvas.width / 2, 60); // Centered 'Welcome' text

    ctx.font = '50px bold Arial'; // Bold font
    ctx.fillStyle = 'yellow';
    ctx.fillText(member.user.username, canvas.width / 2, 120); // Centered username text

    ctx.font = '40px bold Arial'; // Bold font
    ctx.fillStyle = 'white';
    ctx.fillText('Semoga betah disini!', canvas.width / 2, 180); // Centered "Semoga betah disini!" text

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
    });
  }

  if (message.content.toLowerCase() === '!slgoodbye') {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const member = message.member;

    // Create goodbye image with 16:9 aspect ratio (700x393)
    const canvas = createCanvas(700, 393);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text style (bold and centered)
    ctx.textAlign = 'center'; // Align text to the center
    ctx.textBaseline = 'middle'; // Set baseline to middle for proper vertical centering

    // Text styling for Goodbye
    ctx.font = '60px bold Arial'; // Bold and larger font
    ctx.fillStyle = 'white';
    ctx.fillText('Goodbye!', canvas.width / 2, 60); // Centered 'Goodbye' text

    ctx.font = '50px bold Arial'; // Bold font
    ctx.fillStyle = 'yellow';
    ctx.fillText(member.user.username, canvas.width / 2, 120); // Centered username text

    ctx.font = '40px bold Arial'; // Bold font
    ctx.fillStyle = 'white';
    ctx.fillText('Semoga sukses!', canvas.width / 2, 180); // Centered "Semoga sukses!" text

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'goodbye-image.png' }],
    });
  }
});

// Login ke Discord menggunakan token dari .env
client.login(process.env.DISCORD_TOKEN);

// Setup Express server (Optional, untuk menjalankan server Express)
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
