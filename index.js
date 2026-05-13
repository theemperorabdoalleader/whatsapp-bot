const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const qrcode = require("qrcode-terminal");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("📌 امسح الكود ده:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح");
    }

    if (connection === "close") {
      console.log("❌ الاتصال اتقفل... بنحاول تاني");

      // 🔥 أهم سطر (إعادة المحاولة)
      setTimeout(() => {
        startBot();
      }, 3000);
    }
  });
}

startBot();
