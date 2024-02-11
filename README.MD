# Introduction:

The purpose of this project is to provide an easy way to manage translations in Google Sheets using NodeJS. The tool allows users to fetch and upload translations from the spreadsheet, making it simple to keep track of and update translations across different languages and regions.

## Quickstart

### Installing the library:

```bash
npm install gs-translations --save-dev
```

### Initialize the configuration file:

```bash
npx gs-translations -i
```

This will create a `gs-translations.json` file in your project with the following content:

```json
{
  "auth": {
    "client_email": "<Service Account Client Email>",
    "private_key": "<Service Account Private Key>"
  },
  "base_language": "en",
  "languages": ["es", "en"],
  "spreadsheetId": "123456789000000000000000000",
  "sheetName": "Sheet1",
  "target_dir": "./i18n"
}
```

#### Let's explain the configuration file:

- `auth`: This is a JSON object that contains the credentials for the Google Sheets API. The client email and private key are required to authenticate with the Google Sheets API. You need a Service Account to use this tool. For more information on how to create a Service Account, see [this documentation](https://developers.google.com/workspace/guides/get-started)
  > As an alternative, you can use environments variables for these credentials:
  >
  > - TRANSLATIONS_SERVICE_ACCOUNT_EMAIL
  > - TRANSLATIONS_SERVICE_ACCOUNT_PRIVATE_KEY
-
- `base_language`: This is the base language of the translations. It will be used as a fallback language if no translation is found for a given key.
  - The default value is "en".
- `languages`: This is an array of languages that you want to support. You can add more languages if needed.
- `spreadsheetId`: This is the ID of the Google Sheets spreadsheet that contains the translations. You can find this in the URL of your Google Sheets project settings.
- `sheetName`: This is the name of the Google Sheets sheet that contains the translations.
  - The default value is "Sheet1"
- `target_dir`: This is the directory where the generated files will be stored.
  - The default value is "./i18n".

### Fetching translations from the spreadsheet:

```bash
npx gs-translations -f
```

This will fetch all translations from the Google Sheets spreadsheet and save them in a JSON file. The location of the file will follow the pattern `<target_dir>/<language>/translations.json`. For example, if the `target_dir` is set to `./i18n` and the language is `es`, the file will be saved in `./i18n/es/translations.json`.

### Pushing translations to the spreadsheet:

```bash
npx gs-translations -p
```

This will analyze all JSON files in the `target_dir` and push any new keys to the Google Sheets spreadsheet.

> Note that this tool does not update existing translations. If you want to update existing translations, do so manually in the Google Sheets spreadsheet.

> Every language file found in the `target_dir` represents a column in the Google Sheets spreadsheet.

### Example Google Sheets Table Structure:

| key      | en    | es     | fr      |
| -------- | ----- | ------ | ------- |
| greeting | Hello | Hola   | Bonjour |
| name     | Name  | Nombre | Nom     |

### Example JSON files:

`<target_dir>/en/translations.json`:

```json
{
  "greeting": "Hello",
  "name": "Name"
}
```

`<target_dir>/es/translations.json`:

```json
{
  "greeting": "Hola",
  "name": "Nombre"
}
```

`<target_dir>/fr/translations.json`:

```json
{
  "greeting": "Bonjour",
  "name": "Nom"
}
```

# License

This project is licensed under the MIT License. For more information on this license, see the [LICENSE](https://choosealicense.com/licenses/mit/)
