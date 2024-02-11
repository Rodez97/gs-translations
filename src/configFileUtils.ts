import path from "path";
import configTemplate from "./template_gs-translations.json";
import { writeFile } from "fs/promises";

export const CONFIG_FILENAME = "gs-translations.json" as const;

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

export const getConfigFile = () => {
  const workingDir = process.cwd();
  const configData: ConfigFileType = require(path.join(
    workingDir,
    CONFIG_FILENAME
  ));

  if (!configData) {
    throw new Error("Config file not found");
  }

  return configData;
};

export const createTemplateConfigFile = async () => {
  console.log("Creating template config file...");
  const workingDir = process.cwd();
  const targetPath = path.join(workingDir, CONFIG_FILENAME);

  await writeFile(targetPath, JSON.stringify(configTemplate, null, 2));
  console.log("Config file created successfully, please edit it");
};
