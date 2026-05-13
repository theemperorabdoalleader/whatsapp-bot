const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, qr }) => {

    if (qr) {
      console.log("📌 امسح الكود بسرعة:");
      qrcode.generate(qr, { small: true }); // 🔥 ده المهم
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل");
    }

    if (connection === "close") {
      console.log("❌ فصل... مستني");
    }
  });
}

startBot();
