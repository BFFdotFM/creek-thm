
## Future installation should go like this:

1. Install the toolkit with NPM: `npm install -g creek-themes`
1. This will install the toolkit globally.
1. Edit `~/.creek/theme-tools.json` and add your API key.
1. Open a terminal window and `cd` to inside the working folder where you want to edit themes.
1. Run: `creek-themes pull id-or-short-name-of-theme@example.com` -- this will only work if your API key works.
1. `cd short-name-of-theme`
1. While inside the theme's folder, run: `creek-themes watch`

## Notes to get it there

- It will need to create the `~/.creek/` folder on NPM installation.
- You'll need to add a short-name creator to the themes. If you copy a them, then it should enumerate the short-name ("...-2"). You can also edit this short-name in the theme settings and theme.json.
- there should be an API key utility that lets you add a key:
  ```
  > creek-themes add-key example-domain.com
  What is the key for example-domain.com? |
  Ok, key added.
  ```
- the initial theme-tools.json in ~/.creek should have a placeholder object structure.

## Other to-do items

- Pages.
- theme.json
- blocks
- Theme config object doesn't actually update.


- It's going to need blocks for CSS.
- CSS and JS files should have a CSS or JS file in addition to a .json file.
- CSS blocks that have stylus enabled should have a .styl file in the folder.
- Same with JS and CoffeeScript.
- HTML blocks should have block-name.html

- css-main.json

    ```
    {
      "type": "css",
      "name": "css-main",
      "preprocessor": "stylus"
    }
    ```

- BUG: The HTML page is downloaded in Jade and monitor.js is looking for .html

- BUG: The page-name.json and theme.json have different domains: www.kusf.org and kusf.creek.fm

- theme.json settings loaded in JS are not updated when file is changed


# Doc Notes


### Pages

- Pages must have a meta JSON object to go with them.
- Pages must be in a flat directory: only `./pages/*` not `./pages/example/extra/path/*`
- `short_name` is implied by the filename by default, but you can override it in `page-name.json` to get special paths like: `example/path/hello.file`



# Show system dialog if the file was edited in the browser after the file was last edited by `thm`

### On Mac:

```
Traviss-MacBook-Pro:wybc travis$ osascript -e 'tell app "System Events" to display dialog "Creek Themes Toolkit: \n\nWARNING: This theme file (blah.html) was edited in the browser. \n\nAre you sure you want to save?"' 
button returned:OK
Traviss-MacBook-Pro:wybc travis$ osascript -e 'tell app "System Events" to display dialog "Creek Themes Toolkit: \n\nWARNING: This theme file (blah.html) was edited in the browser. \n\nAre you sure you want to save?"' 
28:169: execution error: System Events got an error: User canceled. (-128)
Traviss-MacBook-Pro:wybc travis$ 
```

### On PC:

```
I dunno.
```

### On Linux:

```
I dunno.
```




## TODO:

- Auto-select the last edited theme as the current editing theme, and add a setting to ~/creek-themes/settings.json: `{ auto_edit_theme: true }`
- stylus exported as *.stylus instead of *.styl
- don't crash if the markup parser fails, instead show ERROR
- page update fails on kkxx.creek.fm
- retry failed remote saves
- js-vue.js limited to 65535 bytes: https://www.google.com/search?q=65535+in+binary
- Warn if using master API key, not user API key
- XRAY.fm user API key cannot be changed on profile page
- Move theme files to S3.
- Block settings don't actually save for the special blocks like "posts". Just the main block settings that go into the MySQL block.x data, not block_settings.
- Automatically set the editing theme to the current one that the user is editing.
- Theme unique IDs: theme.unique should be a short identifier like `xrayfm` or `basic-thing`
- Pages are updated globally, rather than per-theme. Breaks staging workflow.
- Fix the "(you may need to reset it [API key] before it works)" thing.
- Ability to update theme.json settings.
- Initialize blank theme, with folder structure and theme.json file.
- Add editing/published status markers to theme list API's response data.
- API endpoints: List blocks, templates, pages.
- Add theme id@domain option to the status updaters, so that you don't need to download the theme and cd into it in order to publish or preview it (i.e. set as editing theme on website).

#### For git collaboration:

- theme.git_branch -- make sure that the branch of the current working directory is sync'd to the theme with the same branch. This allows users to work on their own separate branches, and then update those branches. And when the branch is merged into master, then we run sync on that branch. Or, we can do a deployment hook on git? No.
- theme.git_url -- URL to the theme's git repo. There must be only one official git repo. No forks. If there are forks and someone edits the master branch on that fork, then it will overwrite the actual homepage.
- Check git branch on every save. If git branch is true or has a value, then make sure the changes are submitted to the correct theme with the right branch by including the branch name.
- git_branch should not be in theme.json, it should always be figured out by the current branch in the working directory, or with the "--branch branch-name" option.
- Add git brach to the theme title in the theme editor themes drop-down.
- Add git branch and git URL to the theme edit panel.

- On sync, delete all of blocks/templates/files first. (Uh, watch out?)

#### Before deployment:
- Write documentation on how to do the new git workflow



1. Create a new branch: `git checkout -b name-of-branch`
1. Sync this theme to create it at the remote website: `creek-themes sync up`
1. Set this as the editing theme: `creek-themes status edit`



Possible names:
