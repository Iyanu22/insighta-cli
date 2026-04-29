const chalk = require("chalk");
const axios = require("axios");
const { getCredentials } = require("../lib/config");

module.exports = async function whoami() {
  try {
    const creds = getCredentials();
    console.log("Making direct request with token:", creds.access_token.substring(0, 30) + "...");
    
    const response = await axios.get(
      "https://intelligence-query-engine-green.vercel.app/api/users/me",
      {
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
        },
      }
    );
    
    const user = response.data.data;
    console.log(chalk.bold("\nCurrent User:"));
    console.log(`  Username:  ${chalk.cyan("@" + user.username)}`);
    console.log(`  Email:     ${chalk.cyan(user.email || "N/A")}`);
    console.log(`  Role:      ${chalk.cyan(user.role)}`);
    console.log(`  Member since: ${chalk.cyan(new Date(user.created_at).toLocaleDateString())}`);
  } catch (err) {
    console.error(chalk.red(err.response ? JSON.stringify(err.response.data) : err.message));
  }
};