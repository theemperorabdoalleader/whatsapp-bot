const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

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

  // 🔥 هنا السحر
  const phoneNumber = "201149182286"; // رقمك بدون + ولا 0
  const code = await sock.requestPairingCode(phoneNumber);

  console.log("🔑 كود الربط:", code);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ البوت اشتغل واتربط");
    }
  });
}

startBot();
