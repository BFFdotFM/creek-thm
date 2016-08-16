#Creek Theme Tools

This toolkit includes a file watcher, and a CLI for the Themes API.

## Watcher

This tool watches a theme's folder for changes, and updates the remote theme. If it detects a change, then it will take the right action with that file: updating templates, blocks, regular files, pages, or theme.json.

## Using the Watcher

1. Download the theme as a .zip file from the Creek themes editor. You can find the download button in the theme's settings editor.
1. Note the ID of the theme that's also in the theme's settings editor (at the bottom of the left column).
1. Make sure that you have both **Node.js** and **Git** installed on your system.
1. Clone this themes toolkit into a folder of your choosing. Open a terminal window, `cd` to the folder, and run: `git clone git@bitbucket.org:creekfm/theme-tools.git`
1. `cd creek-themes` to go inside this folder.
1. Edit `settings.json` to set up your API key and the folder of the theme.
  - You can get your API key from: Control Panel > Click your name in the top right corner > Profile > Look for API key (you may need to reset it before it works).
1. To start the watcher, run: `node watch.js`

### Actions

#### Available:

- Update templates.
- Update files.

#### In development:

- Update pages.
- Update theme.json.
- Update blocks.
