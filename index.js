const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true // أول مرة بس عشان تعمل تسجيل
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("📌 امسح الـ QR من واتساب:")
      console.log(qr)
    }

    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح")
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

      console.log("🔄 إعادة تشغيل البوت...", shouldReconnect)

      if (shouldReconnect) {
        startBot()
      }
    }
  })
}

startBot()
