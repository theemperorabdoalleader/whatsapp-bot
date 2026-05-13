const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  let codeRequested = false; // 🔥 عشان نطلب الكود مرة واحدة بس

  sock.ev.on("connection.update", async (update) => {
    const { connection, receivedPendingNotifications } = update;

    // 🔥 هنا اللحظة الصح
    if (!codeRequested && receivedPendingNotifications === false) {
      codeRequested = true;

      try {
        const code = await sock.requestPairingCode("201149182286");
        console.log("📌 كود الربط:", code);
      } catch (err) {
        console.log("❌ خطأ:", err.message);
      }
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح");
    }

    if (connection === "close") {
      console.log("❌ الاتصال اتقفل... بيحاول تاني");

      setTimeout(() => {
        startBot();
      }, 5000);
    }
  });
}

startBot();
