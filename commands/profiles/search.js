const chalk = require("chalk");
const Table = require("cli-table3");
const axios = require("axios");
const { getCredentials } = require("../../lib/config");

module.exports = async function search(query) {
  console.log(chalk.blue(`Searching for "${query}"...`));
  try {
    const creds = getCredentials();
    if (!creds) throw new Error("Not logged in. Run: insighta login");

    const response = await axios.get(
      "https://intelligence-query-engine-green.vercel.app/api/profiles/search",
      {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
        },
      }
    );

    const result = response.data;
    console.log(chalk.bold(`\nSearch Results — ${result.total} found\n`));

    const table = new Table({
      head: ["Name", "Gender", "Age", "Age Group", "Country"].map(h => chalk.cyan(h)),
      colWidths: [25, 10, 6, 12, 10],
    });

    result.data.forEach(p => {
      table.push([p.name, p.gender, p.age, p.age_group, p.country_id]);
    });

    console.log(table.toString());
  } catch (err) {
    console.error(chalk.red(err.response ? JSON.stringify(err.response.data) : err.message));
  }
};