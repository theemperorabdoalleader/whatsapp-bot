const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

// مهم عشان Railway مايقفلش
app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

app.listen(PORT, () => {
  console.log("🌐 Server running on port", PORT);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, qr }) => {

    if (qr) {
      console.log("📌 امسح الكود بسرعة:");
      qrcode.generate(qr, { small: true }); // 🔥 ده اللي هيظهر QR
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل واتربط");
    }

    if (connection === "close") {
      console.log("❌ الاتصال اتقفل (مستني بدون إعادة تشغيل)");
    }
  });
}

startBot();
