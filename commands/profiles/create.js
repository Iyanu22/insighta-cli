const chalk = require("chalk");
const axios = require("axios");
const { getCredentials } = require("../../lib/config");

module.exports = async function create(options) {
  console.log(chalk.blue(`Creating profile for "${options.name}"...`));
  try {
    const creds = getCredentials();
    if (!creds) throw new Error("Not logged in. Run: insighta login");

    const response = await axios.post(
      "https://intelligence-query-engine-green.vercel.app/api/profiles",
      { name: options.name },
      {
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
          "Content-Type": "application/json",
        },
      }
    );

    const p = response.data.data;
    console.log(chalk.green("\n✅ Profile created successfully!"));
    console.log(`  Name:    ${chalk.cyan(p.name)}`);
    console.log(`  Gender:  ${chalk.cyan(p.gender)}`);
    console.log(`  Age:     ${chalk.cyan(p.age)} (${p.age_group})`);
    console.log(`  Country: ${chalk.cyan(p.country_id)} (${p.country_name})`);
  } catch (err) {
    console.error(chalk.red(err.response ? JSON.stringify(err.response.data) : err.message));
  }
};