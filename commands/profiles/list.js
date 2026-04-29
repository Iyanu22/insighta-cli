const chalk = require("chalk");
const Table = require("cli-table3");
const axios = require("axios");
const { getCredentials } = require("../../lib/config");

module.exports = async function list(options) {
  console.log(chalk.blue("Fetching profiles..."));

  try {
    const creds = getCredentials();
    if (!creds) throw new Error("Not logged in. Run: insighta login");

    const params = {};
    if (options.gender) params.gender = options.gender;
    if (options.country) params.country_id = options.country;
    if (options.ageGroup) params.age_group = options.ageGroup;
    if (options.minAge) params.min_age = options.minAge;
    if (options.maxAge) params.max_age = options.maxAge;
    if (options.sortBy) params.sort_by = options.sortBy;
    if (options.order) params.order = options.order;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;

    const response = await axios.get(
      "https://intelligence-query-engine-green.vercel.app/api/profiles",
      {
        params,
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "X-API-Version": "1",
        },
      }
    );

    const result = response.data;
    console.log(chalk.bold(`\nProfiles — Page ${result.page}/${result.total_pages} (${result.total} total)\n`));

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