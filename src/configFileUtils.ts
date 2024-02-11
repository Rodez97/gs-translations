import path from "path";
import { existsSync, writeFileSync } from "node:fs";
import chalk from "chalk";

export const CONFIG_FILENAME = "gs-translations.config.json" as const;

export type ConfigFileType = {
  auth: {
    client_email: string;
    private_key: string;
  };
  spreadsheetId: string;
  sheetName: string;
  target_dir: string;
  base_language: string;
  languages: string[];
};

export const TemplateConfigFile = {
  auth: {
    client_email: "<Service Account Client Email>",
    private_key: "<Service Account Private Key>",
  },
  base_language: "en",
  languages: ["es", "en"],
  spreadsheetId: "123456789000000000000000000",
  sheetName: "Sheet1",
  target_dir: "./i18n",
};

export const getConfigFile = () => {
  const workingDir = process.cwd();
  const configData: ConfigFileType = require(path.join(
    workingDir,
    CONFIG_FILENAME
  ));

  if (!configData) {
    console.error(chalk.red("Config file not found"));
    return;
  }

  return configData;
};

export const createTemplateConfigFile = async () => {
  const workingDir = process.cwd();
  const targetPath = path.join(workingDir, CONFIG_FILENAME);

  console.log(
    chalk.blue("Creating config file: "),
    chalk.underline.blue(targetPath)
  );

  if (existsSync(targetPath)) {
    console.error(chalk.red("Config file already exists"));
    return;
  }

  const stringFile = JSON.stringify(TemplateConfigFile, null, 2);

  writeFileSync(targetPath, stringFile, {
    encoding: "utf-8",
    flag: "w+",
  });

  console.log(chalk.green("Config file created successfully!, please edit it"));
};
