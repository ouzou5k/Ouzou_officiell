const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
    const from = m.key.remoteJid;

    if (body.startsWith(".")) {
      const command = body.slice(1).trim().toLowerCase();
      if (command === "ping") {
        await sock.sendMessage(from, { text: "🏓 Pong!" });
      }
    }
  });
}

startBot();
