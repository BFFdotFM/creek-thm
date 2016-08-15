#Creek Theme Tools

This toolkit includes a file watcher, and a CLI for the Themes API.

## Watcher

This tool watches a theme's folder for changes, and updates the remote theme. If it detects a change, then it will take the right action with that file: updating templates, blocks, regular files, pages, or theme.json.

## Using the Watcher

1. Make sure that you have both **Node.js** and **Git** installed on your system.
1. Clone this themes toolkit into a folder of your choosing. Open a terminal window, `cd` to the folder, and run: `git clone git@bitbucket.org:creekfm/theme-tools.git`
1. `cd creek-themes` to go inside this folder.
1. Edit `settings.json` to set up your API key and the folder of the theme.
1. To start the watcher, run: `node watch.js`

### Actions

#### Available:

- Update templates.
- Update files.

#### In development:

- Update theme.json.
- Update blocks.

<!--

1. Install the toolkit with NPM: `npm install -g creek-themes`
1. This will install the toolkit globally.
1. Open a terminal window and `cd` to inside the folder of the theme that you want to edit.
1. Run: `creek-themes watch`

-->
