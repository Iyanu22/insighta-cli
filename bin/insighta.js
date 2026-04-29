#!/usr/bin/env node
const { program } = require("commander");

program
  .name("insighta")
  .description("Insighta Labs CLI")
  .version("1.0.0");

// Auth commands
program
  .command("login")
  .description("Login with GitHub")
  .action(require("../commands/login"));

program
  .command("logout")
  .description("Logout from Insighta")
  .action(require("../commands/logout"));

program
  .command("whoami")
  .description("Show current user")
  .action(require("../commands/whoami"));

// Profiles commands
const profiles = program.command("profiles").description("Manage profiles");

profiles
  .command("list")
  .description("List all profiles")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country ID")
  .option("--age-group <ageGroup>", "Filter by age group")
  .option("--min-age <minAge>", "Filter by minimum age")
  .option("--max-age <maxAge>", "Filter by maximum age")
  .option("--sort-by <sortBy>", "Sort by field")
  .option("--order <order>", "Sort order (asc/desc)")
  .option("--page <page>", "Page number")
  .option("--limit <limit>", "Results per page")
  .action(require("../commands/profiles/list"));

profiles
  .command("get <id>")
  .description("Get a profile by ID")
  .action(require("../commands/profiles/get"));

profiles
  .command("search <query>")
  .description("Search profiles using natural language")
  .action(require("../commands/profiles/search"));

profiles
  .command("create")
  .description("Create a new profile")
  .requiredOption("--name <name>", "Name to classify")
  .action(require("../commands/profiles/create"));

profiles
  .command("export")
  .description("Export profiles to CSV")
  .option("--format <format>", "Export format (csv)", "csv")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country ID")
  .action(require("../commands/profiles/export"));

program.parse(process.argv);