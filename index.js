const { Client, Intents } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ]
});

const token = process.env.DISCORD_BOT_TOKEN;
const welcomeImageUrl = 'https://i.imgur.com/ht3HiAG.jpeg'; // Gambar untuk welcome dan goodbye
const welcomeChannelId = '1313095157477802034';  // Ganti dengan ID channel untuk welcome
const goodbyeChannelId = '1313095157477802034';  // Ganti dengan ID channel untuk goodbye

// Fungsi untuk mengirim gambar welcome
async function sendWelcomeImage(message) {
  const member = message.mentions.members.first();

  if (!member) return;

  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  // Muat gambar background
  const backgroundImage = await loadImage(welcomeImageUrl);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar background ke canvas

  // Muat foto profil member dan tampilkan dalam bentuk lingkaran
  const profileImage = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 128 }));
  const circleX = 100; // Posisi X untuk lingkaran
  const circleY = 50;  // Posisi Y untuk lingkaran
  const circleRadius = 50; // Radius lingkaran

  // Gambar lingkaran untuk profil
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip(); // Masking untuk lingkaran

  // Menambahkan gambar profil member dalam lingkaran
  ctx.drawImage(profileImage, circleX - circleRadius, circleY - circleRadius, circleRadius * 2, circleRadius * 2);

  // Menambahkan teks "Welcome" (ukuran terbesar)
  ctx.font = 'bold 60px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFFFFF'; // Warna teks "Welcome"
  ctx.textAlign = 'center';
  ctx.fillText('Welcome', canvas.width / 2, 60);

  // Menambahkan teks username member (lebih kecil)
  ctx.font = 'bold 50px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFD700'; // Warna teks untuk username
  ctx.fillText(member.user.username, canvas.width / 2, 120);

  // Menambahkan teks "Semoga betah disini!" (sama seperti teks kedua)
  ctx.font = 'bold 50px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFFFFF'; // Warna teks "Semoga betah disini!"
  ctx.fillText('Semoga betah disini!', canvas.width / 2, 180);

  // Mengonversi canvas menjadi buffer
  const buffer = canvas.toBuffer();

  // Kirim pesan ke channel dengan gambar dan teks
  const attachment = {
    files: [{
      attachment: buffer,
      name: 'welcome-image.png',
    }]
  };

  // Kirim gambar welcome ke channel
  message.channel.send({ content: `Selamat datang ${member}`, files: attachment.files });
}

// Fitur slgoodbye untuk melihat hasil goodbye tanpa menunggu member keluar
async function sendGoodbyeImage(message) {
  const member = message.mentions.members.first();

  if (!member) return;

  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  // Muat gambar background
  const backgroundImage = await loadImage(welcomeImageUrl);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar background ke canvas

  // Muat foto profil member dan tampilkan dalam bentuk lingkaran
  const profileImage = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 128 }));
  const circleX = 100; // Posisi X untuk lingkaran
  const circleY = 50;  // Posisi Y untuk lingkaran
  const circleRadius = 50; // Radius lingkaran

  // Gambar lingkaran untuk profil
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip(); // Masking untuk lingkaran

  // Menambahkan gambar profil member dalam lingkaran
  ctx.drawImage(profileImage, circleX - circleRadius, circleY - circleRadius, circleRadius * 2, circleRadius * 2);

  // Menambahkan teks "Goodbye" (ukuran terbesar)
  ctx.font = 'bold 60px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFFFFF'; // Warna teks "Goodbye"
  ctx.textAlign = 'center';
  ctx.fillText('Goodbye', canvas.width / 2, 60);

  // Menambahkan teks username member (lebih kecil)
  ctx.font = 'bold 50px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFD700'; // Warna teks untuk username
  ctx.fillText(member.user.username, canvas.width / 2, 120);

  // Menambahkan teks "Semoga sukses selalu!" (sama seperti teks kedua)
  ctx.font = 'bold 50px "Arial Black", sans-serif'; // Font tebal
  ctx.fillStyle = '#FFFFFF'; // Warna teks "Semoga sukses selalu!"
  ctx.fillText('Semoga sukses selalu!', canvas.width / 2, 180);

  // Mengonversi canvas menjadi buffer
  const buffer = canvas.toBuffer();

  // Kirim pesan goodbye ke channel
  const attachment = {
    files: [{
      attachment: buffer,
      name: 'goodbye-image.png',
    }]
  };

  // Kirim gambar goodbye ke channel
  message.channel.send({ content: `Selamat tinggal ${member}`, files: attachment.files });
}

// Event handler untuk bot
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!slwelcome') {
    // Hanya admin yang bisa menggunakan perintah ini
    if (!message.member.permissions.has('ADMINISTRATOR')) return;
    sendWelcomeImage(message);
  }

  if (message.content.toLowerCase() === '!slgoodbye') {
    // Hanya admin yang bisa menggunakan perintah ini
    if (!message.member.permissions.has('ADMINISTRATOR')) return;
    sendGoodbyeImage(message);
  }
});

// Login bot dengan token
client.login(token);
