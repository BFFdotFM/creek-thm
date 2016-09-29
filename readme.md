# Creek Theme Tools

This toolkit includes a file watcher, and a CLI for the Themes API.

## Watcher

This tool watches a theme's folder for changes, and updates the remote theme. If it detects a change, then it will take the right action with that file: updating templates, blocks, regular files, pages, or theme.json.

### Using the Watcher

1. Make sure that you have [Node.js](https://nodejs.org/en/) installed on your system.
1. Install the toolkit with NPM: `npm install -g creek-themes`
1. This will install the toolkit globally.
1. Start the toolkit set-up process: `creek-themes install`
1. Follow the instructions to install your API key and website domain in the theme settings at: `~/.creek-themes/settings.json`
    - You can get your API key here:
        1. Sign into the Control Panel.
        1. Click your name in the top right corner.
        1. Profile.
        1. Look for API key (you may need to reset it before it works).
1. `cd` into the folder where you would like to download the remote theme.
1. List the available themes: `creek-themes list example-domain.com`
1. Download the desired theme to your local machine: `creek-themes download 123@example-domain.com` &mdash; In this example, **123** is the ID number of the theme.
1. `cd` into the theme's directory.
1. Start the watcher: `creek-themes watch`

## Commands

#### While inside a theme directory

Run these after `cd`-ing into the theme's directory.

- `creek-themes watch`
- `creek-themes status edit` &mdash; edit this theme.
- `creek-themes status publish` &mdash; publish this theme.
- `creek-themes status ` &mdash; publish for all user types, just managers, or just hosts.

#### While inside any directory

- `creek-themes install` &mdash; configure creek-themes environment. Adds files to: `~/.creek-themes/...`
- `creek-themes uninstall` &mdash; remove creek-themes environment settings. Removes files from: `~/.creek-themes/...`
- `creek-themes download 123@example-domain.com` &mdash; download the theme folder.
- `creek-themes list example-domain.com` &mdash; list all of the themes at a domain.


## TODO:

- Ability to update theme.json settings.
- Sync theme up.
- Initialize blank theme, with folder structure and theme.json file.
- Label themes in themes list as editing, published, ...
- Make sure that zip file's blocks include markup files.
- List blocks, templates, pages.

## Tips

### Installing Node.js

#### On Windows

- You can use the Windows command prompt to run these same commands. It works the same way Mac, Windows, and Linux.

- A quick way to get started is to shift + right click on your themes folder and select "Open in Command Prompt".
