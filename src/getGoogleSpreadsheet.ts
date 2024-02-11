import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { getConfigFile } from "./configFileUtils";

export default function getSpreadsheet() {
  const configData = getConfigFile();

  if (!configData) {
    return;
  }

  const serviceAccountAuth = new JWT({
    email:
      process.env.TRANSLATIONS_SERVICE_ACCOUNT_EMAIL ??
      configData.auth.client_email,
    key:
      process.env.TRANSLATIONS_SERVICE_ACCOUNT_PRIVATE_KEY ??
      configData.auth.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //# Initialize the sheet
  return new GoogleSpreadsheet(configData.spreadsheetId, serviceAccountAuth); //# spreadsheet ID
}
