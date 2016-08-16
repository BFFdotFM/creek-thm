
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
