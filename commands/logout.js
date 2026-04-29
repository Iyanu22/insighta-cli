const axios = require("axios");
const chalk = require("chalk");
const { getCredentials, clearCredentials, API_URL } = require("../lib/config");

module.exports = async function logout() {
  const creds = getCredentials();
  if (!creds) {
    console.log(chalk.yellow("You are not logged in."));
    return;
  }

  try {
    await axios.post(`${API_URL}/auth/logout`, {
      refresh_token: creds.refresh_token,
    });
  } catch (err) {
    // Ignore errors
  }

  clearCredentials();
  console.log(chalk.green("Logged out successfully."));
};