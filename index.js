const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, qr }) => {

    if (qr) {
      console.log("📌 امسح الكود:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل 100%");
    }

    if (connection === "close") {
      console.log("❌ فصل... بيعيد");
      setTimeout(startBot, 15000);
    }
  });
}

startBot();
