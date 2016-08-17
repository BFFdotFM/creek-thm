#Creek Theme Tools

This toolkit includes a file watcher, and a CLI for the Themes API.

## Watcher

This tool watches a theme's folder for changes, and updates the remote theme. If it detects a change, then it will take the right action with that file: updating templates, blocks, regular files, pages, or theme.json.

## Using the Watcher

1. Download the theme as a .zip file from the Creek themes editor, and unzip it. You can find the download button in the theme's settings editor.
1. Note the ID of the theme that's also in the theme's settings editor (at the bottom of the left column).
1. Make sure that you have [Node.js](https://nodejs.org/en/) installed on your system.
1. Install the toolkit with NPM: `npm install -g creek-themes`
1. This will install the toolkit globally.
1. Run: `creek-themes install`
1. Follow the instructions to install your API key and website domain in the theme settings at: `~/.creek-themes/settings.json`
  - You can get your API key here: Control Panel > Click your name in the top right corner > Profile > Look for API key (you may need to reset it before it works).
1. `cd` into the unzipped folder of the theme that you downloaded.
1. To start the watcher, run: `creek-themes watch`


### Actions

#### Available:

- Update templates.
- Update files.

#### In development:

- Update pages.
- Update theme.json.
- Update blocks.
