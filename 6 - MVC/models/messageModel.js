const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/data.json");

function readMessages() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveMessages(messages) {
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  add: (username, text) => {
    const messages = readMessages();

    const safeName = escapeHTML(username);
    const safeText = escapeHTML(text);

    messages.push({ username: safeName, text: safeText, time: Date.now() });
    saveMessages(messages);
  },
  getAll: () => {
    return readMessages();
  },
};
