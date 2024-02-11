import { readFile } from "fs/promises";
import getSpreadsheet from "./getGoogleSpreadsheet";
import { getConfigFile } from "./configFileUtils";

export default async function pushTranslations() {
  //# Initialize the sheet
  const doc = getSpreadsheet();

  const configData = getConfigFile();

  const traverseNew = function (
    objects: {
      language: string;
      label: string;
      data: any;
    }[],
    arr: any[]
  ): ({ key: string } & Record<string, any>)[] {
    const baseLanguage = configData.base_language;

    const baseObj = objects.find((obj) => obj.language === baseLanguage);
    const restLangs = objects.filter((obj) => obj.language !== baseLanguage);

    if (!baseObj) {
      throw new Error(`Base language ${baseLanguage} not found`);
    }

    const baseObjData = baseObj.data;

    for (const i in baseObjData) {
      if (baseObjData[i] !== null && typeof baseObjData[i] == "object") {
        //# going one step down in the object tree!!
        const label = baseObj.label !== "" ? `${baseObj.label}.${i}` : `${i}`;
        const childBase = {
          label,
          data: baseObjData[i],
          language: baseLanguage,
        };
        const children = restLangs.map((obj) => {
          return { label, data: obj.data[i], language: obj.language };
        });
        // const children = { label: label, data: objData[i] };
        traverseNew([childBase, ...children], arr);
      } else {
        arr.push({
          key: baseObj.label !== "" ? `${baseObj.label}.${i}` : `${i}`,
          [baseLanguage]: baseObjData[i],
          ...restLangs.reduce<Record<string, any>>((acc, obj) => {
            acc[obj.language] = obj.data[i];
            return acc;
          }, {}),
        });
      }
    }

    return arr;
  };

  const read = async () => {
    console.log("Fetching translations from Google Sheets...");
    await doc.loadInfo(); //# loads document properties and worksheets
    const sheet = doc.sheetsByTitle[configData.sheetName]; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
    const rows = await sheet.getRows({ limit: sheet.rowCount }); //# fetch rows from the sheet (limited to row count)
    //# read /public/locales/en/translation.json
    const languages = configData.languages;
    const basePath = configData.target_dir;

    console.log("Reading translation files from:", basePath);
    const actions = languages.map(async (language) => {
      const targetPath = `${basePath}/${language}/translation.json`;
      const lang = await readFile(targetPath, {
        encoding: "utf8",
        flag: "r",
      });
      const obj = { language, label: "", data: JSON.parse(lang) };
      return obj;
    });

    const results = await Promise.all(actions);

    const arr: any[] = [];

    console.log("Traversing new translations...");
    const result = traverseNew(results, arr);

    //# Get only new rows
    const el = result.filter(({ key }) => {
      return !rows.map((row) => row.get("key")).includes(key);
    });

    console.log("Found new translations:", el.length, "rows");
    el.forEach((row) => console.log("--> ", row.key));
    return el;
  };

  const append = async (
    data: ({
      key: string;
    } & Record<string, any>)[]
  ) => {
    console.log("Appending translations to Google Sheets...");
    await doc.loadInfo(); //# loads document properties and worksheets
    const sheet = doc.sheetsByTitle[configData.sheetName]; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
    await sheet.addRows(data); //# append rows
  };

  try {
    const data = await read();
    await append(data);
    console.log("Done!");
  } catch (error) {
    console.error(error);
  }
}
