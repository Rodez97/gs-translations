import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import getSpreadsheet from "./getGoogleSpreadsheet";
import { getConfigFile } from "./configFileUtils";

export default async function fetchTranslations() {
  //# Initialize the sheet
  const doc = getSpreadsheet();

  const configData = getConfigFile();

  if (!configData || !doc) {
    return;
  }

  const read = async () => {
    console.log("Fetching translations from Google Sheets...");
    await doc.loadInfo(); //# loads document properties and worksheets
    const sheet = doc.sheetsByTitle[configData.sheetName]; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
    await sheet.loadHeaderRow(); //# loads the header row (first row) of the sheet
    const colTitles = sheet.headerValues; //# array of strings from cell values in the first row
    const rows = await sheet.getRows({ limit: sheet.rowCount }); //# fetch rows from the sheet (limited to row count)
    let result: Record<string, any> = {};
    rows.map((row) => {
      colTitles.slice(1).forEach((title) => {
        result[title] = result[title] ?? [];
        const key = row.get(colTitles[0]);
        result = {
          ...result,
          [title]: {
            ...result[title],
            [key]: row.get(title) !== "" ? row.get(title) : undefined,
          },
        };
      });
    });
    return result;
  };

  const write = async (data: Record<string, any>) => {
    console.log("Writing translations to files...");
    const actions = Object.keys(data).map(async (key) => {
      const tempObject = data[key];
      const targetPath = `${configData.target_dir}/${key}`;

      // Check if the target path exists, if not, create it
      const exists = existsSync(targetPath);
      if (!exists) {
        await mkdir(targetPath, { recursive: true });
      }

      await writeFile(
        `${targetPath}/translation.json`,
        JSON.stringify(tempObject, null, 2)
      );
    });

    await Promise.all(actions);
  };

  try {
    const data = await read();
    await write(data);
    console.log("Done!");
  } catch (error) {
    console.error(error);
  }
}
