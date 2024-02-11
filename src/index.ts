#! /usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import fetchTranslations from "./fetch-google-spreadsheet";
import pushTranslations from "./push-google-spreadsheet";
import { createTemplateConfigFile } from "./configFileUtils";

const program = new Command();

console.log(chalk.green.bold(figlet.textSync("i18n-google-sheets")));

console.log(
  chalk.blue.bold("🌐 Welcome to i18n-google-sheets, use -h for help")
);

program
  .version("0.0.1")
  .name("i18n-google-sheets")
  .description("Use Google Sheets as a translation source for i18n")
  .option("-f, --fetch", "⬇️ Fetch Translations from Google Sheets")
  .option("-p, --push", "⬆️ Push Translations to Google Sheets")
  .option("-i, --init", "⚙️ Create a Template Config File")
  .option("-h, --help", "🛟 Show help", true);

program.parse(process.argv);

const options = program.opts();

if (options.fetch) {
  fetchTranslations();
}

if (options.push) {
  pushTranslations();
}

if (options.init) {
  createTemplateConfigFile();
}

if (options.help) {
  program.help();
}
