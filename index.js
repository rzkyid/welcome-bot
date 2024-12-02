require('dotenv').config(); // Memuat konfigurasi dari .env
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');
const express = require('express');

// Daftarkan font Bebas Neue
registerFont('./fonts/BebasNeue-Regular.ttf', { family: 'Bebas Neue' });

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

// Function to add text with shadow
function addTextWithShadow(ctx, text, font, color, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Set shadow properties
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 6;

  // Draw the text with shadow
  ctx.fillText(text, x, y);
}

// Function to draw profile picture in a circle
async function drawProfilePicture(ctx, user, x, y, size) {
  try {
    // Get avatar URL and ensure it's in PNG format
    let avatarURL = user.displayAvatarURL({ size: 128, extension: 'png' });

    // Debugging log: Show the final avatar URL
    console.log(`Attempting to load avatar from URL: ${avatarURL}`);

    // Load the avatar image
    const avatar = await loadImage(avatarURL);
    console.log('Avatar loaded successfully');

    // Create a circular clipping path
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2); // Draw circle at (x, y) with radius size/2
    ctx.closePath();
    ctx.clip();  // Clip the context to the circle

    // Draw the profile picture inside the circle
    ctx.drawImage(avatar, x - size / 2, y - size / 2, size, size); // Draw image at the center of the circle
  } catch (error) {
    console.error('Error loading or drawing avatar:', error);
  }
}

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
  const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
  const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
  const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

  // Position for profile picture (centered)
  const profilePicX = canvas.width / 2;
  const profilePicY = 130;  // Posisi Y diatur lebih tinggi
  const profilePicSize = 100;

  // Draw profile picture in the center above the text
  await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

  // Add text to canvas with shadow (make sure the text is below the image)
  addTextWithShadow(ctx, 'Welcome!', fontMain, 'white', canvas.width / 2, 230); // Teks pertama, posisi y = 230
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 270); // Teks kedua, posisi y = 270
  addTextWithShadow(ctx, 'Semoga betah disini!', fontTertiary, 'white', canvas.width / 2, 310); // Teks ketiga, posisi y = 310

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
  const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
  const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
  const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

  // Position for profile picture (centered)
  const profilePicX = canvas.width / 2;
  const profilePicY = 130;  // Posisi Y diatur lebih tinggi
  const profilePicSize = 100;

  // Draw profile picture in the center above the text
  await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

  // Add text to canvas with shadow (make sure the text is below the image)
  addTextWithShadow(ctx, 'Goodbye!', fontMain, 'white', canvas.width / 2, 230); // Teks pertama, posisi y = 230
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 270); // Teks kedua, posisi y = 270
  addTextWithShadow(ctx, 'Semoga sukses!', fontTertiary, 'white', canvas.width / 2, 310); // Teks ketiga, posisi y = 310

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
    const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
    const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
    const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

    // Position for profile picture (centered)
    const profilePicX = canvas.width / 2;
    const profilePicY = 130;  // Posisi Y diatur lebih tinggi
    const profilePicSize = 100;

    // Draw profile picture in the center above the text
    await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

    // Add text to canvas with shadow (make sure the text is below the image)
    addTextWithShadow(ctx, 'Welcome!', fontMain, 'white', canvas.width / 2, 230); // Teks pertama, posisi y = 230
    addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 270); // Teks kedua, posisi y = 270
    addTextWithShadow(ctx, 'Semoga betah disini!', fontTertiary, 'white', canvas.width / 2, 310); // Teks ketiga, posisi y = 310

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
    const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
    const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
    const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

    // Position for profile picture (centered)
    const profilePicX = canvas.width / 2;
    const profilePicY = 130;  // Posisi Y diatur lebih tinggi
    const profilePicSize = 100;

    // Draw profile picture in the center above the text
    await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

    // Add text to canvas with shadow (make sure the text is below the image)
    addTextWithShadow(ctx, 'Goodbye!', fontMain, 'white', canvas.width / 2, 230); // Teks pertama, posisi y = 230
    addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 270); // Teks kedua, posisi y = 270
    addTextWithShadow(ctx, 'Semoga sukses!', fontTertiary, 'white', canvas.width / 2, 310); // Teks ketiga, posisi y = 310

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
