# API - directus-serve

Tool to manage files for directus serve extension

## upload

Upload a folder to the Directus instance with correct path as location.

> You can use `upload.json` as a config file. 
  By default it tries to search for the configuration otherwise use a correct path by passing `--config=./upload.json`.

| long              | short | description                                            | required | defaultValue |
| :---------------- | :---: | :----------------------------------------------------- | :------: | :----------- |
| `--directusUrl`   |  `-u` | URL of Directus URL                                    |    `✅`   |              |
| `--src`           |  `-s` | Source folder with all files                           |    `✅`   |              |
| `--directusToken` |  `-t` | Token of Directus user with upload permissions.        |    `❌`   |              |
| `--uploadFolder`  |  `-f` | ID of directus folder where files should be uploaded.  |    `❌`   |              |
| `--dry`           |  `-d` | Do a dry run with this command - prints/returns output |    `❌`   |              |
| `--debug`         |  `-g` | Extra logging                                          |    `❌`   |              |
| `--config`        |  `-c` | Path to configuration file                             |    `❌`   |              |
| `--ignore`        |  `-i` | Glob or path like to exclude from files                |    `❌`   | `[]`         |

