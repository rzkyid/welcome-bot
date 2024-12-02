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

const WELCOME_IMAGE_URL = 'https://i.imgur.com/ht3HiAG.jpeg';
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

  // Create welcome image
  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Load profile picture
  const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 128 }));
  ctx.beginPath();
  ctx.arc(90, 90, 70, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(avatar, 20, 20, 140, 140);

  // Text styling for Welcome
  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Welcome!', 220, 60);

  ctx.font = '40px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText(member.user.username, 220, 120);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Semoga betah disini!', 220, 180);

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

  // Create goodbye image
  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Load profile picture
  const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 128 }));
  ctx.beginPath();
  ctx.arc(90, 90, 70, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(avatar, 20, 20, 140, 140);

  // Text styling for Goodbye
  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Goodbye!', 220, 60);

  ctx.font = '40px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText(member.user.username, 220, 120);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Semoga sukses!', 220, 180);

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

    // Create welcome image
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Load profile picture
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 128 }));
    ctx.beginPath();
    ctx.arc(90, 90, 70, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(avatar, 20, 20, 140, 140);

    // Text styling for Welcome
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Welcome!', 220, 60);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText(member.user.username, 220, 120);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Semoga betah disini!', 220, 180);

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
    });
  }

  if (message.content.toLowerCase() === '!slgoodbye') {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const member = message.member;

    // Create goodbye image
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Load profile picture
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 128 }));
    ctx.beginPath();
    ctx.arc(90, 90, 70, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(avatar, 20, 20, 140, 140);

    // Text styling for Goodbye
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Goodbye!', 220, 60);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText(member.user.username, 220, 120);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Semoga sukses!', 220, 180);

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'goodbye-image.png' }],
    });
  }
});

// Login ke Discord menggunakan token dari .env
client.login(process.env.DISCORD_BOT_TOKEN);

// Setup Express server (Optional, untuk menjalankan server Express)
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
