const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { getCredentials } = require("../../lib/config");

module.exports = async function exportProfiles(options) {
  console.log(chalk.blue("Exporting profiles..."));
  try {
    const creds = getCredentials();
    if (!creds) throw new Error("Not logged in. Run: insighta login");

    const params = {};
    if (options.gender) params.gender = options.gender;
    if (options.country) params.country_id = options.country;

    const response = await axios.get(
      "https://intelligence-query-engine-green.vercel.app/api/profiles/export",
      {
        params,
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
        },
        responseType: "text",
      }
    );

    const filename = `profiles_${Date.now()}.csv`;
    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, response.data);
    console.log(chalk.green(`✅ Exported to ${filename}`));
  } catch (err) {
    console.error(chalk.red(err.response ? JSON.stringify(err.response.data) : err.message));
  }
};