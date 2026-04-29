const os = require("os");
const path = require("path");
const fs = require("fs");

const CONFIG_DIR = path.join(os.homedir(), ".insighta");
const CREDENTIALS_FILE = path.join(CONFIG_DIR, "credentials.json");
const API_URL = "https://intelligence-query-engine-green.vercel.app";

function getCredentials() {
  if (!fs.existsSync(CREDENTIALS_FILE)) return null;
  return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf8"));
}

function saveCredentials(data) {
  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2));
}

function clearCredentials() {
  if (fs.existsSync(CREDENTIALS_FILE)) fs.unlinkSync(CREDENTIALS_FILE);
}

module.exports = { API_URL, getCredentials, saveCredentials, clearCredentials };