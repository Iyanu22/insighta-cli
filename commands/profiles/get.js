const chalk = require("chalk");
const axios = require("axios");
const { getCredentials } = require("../../lib/config");

module.exports = async function get(id) {
  console.log(chalk.blue("Fetching profile..."));
  try {
    const creds = getCredentials();
    if (!creds) throw new Error("Not logged in. Run: insighta login");

    const response = await axios.get(
      `https://intelligence-query-engine-green.vercel.app/api/profiles/${id}`,
      {
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
        },
      }
    );

    const p = response.data.data;
    console.log(chalk.bold("\nProfile Details:"));
    console.log(`  ID:                  ${chalk.cyan(p.id)}`);
    console.log(`  Name:                ${chalk.cyan(p.name)}`);
    console.log(`  Gender:              ${chalk.cyan(p.gender)}`);
    console.log(`  Gender Probability:  ${chalk.cyan(p.gender_probability)}`);
    console.log(`  Age:                 ${chalk.cyan(p.age)}`);
    console.log(`  Age Group:           ${chalk.cyan(p.age_group)}`);
    console.log(`  Country:             ${chalk.cyan(p.country_id)} (${p.country_name})`);
    console.log(`  Country Probability: ${chalk.cyan(p.country_probability)}`);
    console.log(`  Created At:          ${chalk.cyan(p.created_at)}`);
  } catch (err) {
    console.error(chalk.red(err.response ? JSON.stringify(err.response.data) : err.message));
  }
};