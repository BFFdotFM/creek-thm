# thm

A theme developer toolkit (CLI) for the Creek website platform and its Themes API.

- **Develop themes with your favorite text editor.** Just edit the files. Then, push your changes to the remote website to preview them. Or, use the automatic file watcher.

- **Edit staging themes, and push changes live when ready.**

    - Use: `thm status publish`

    - Or, if using git, `git merge` your development branch with your public branch, and `thm sync up`.

- **Safely collaborate with git.** When you create a git branch, `thm` will create a remote theme for that branch. Merge and sync when ready.

- **Download and use themes.** Get packaged themes, and install them on your website, all from the CLI.

- **Manage your API keys for theme design.** Easily maintain the designs for multiple Creek-powered websites.

---

### 1. Install

1. Make sure that you have [Node.js](https://nodejs.org/en/) installed on your system.
1. Install the toolkit with NPM: `npm install -g thm`
1. Install your user settings: `thm install`
    - Follow the instructions to install your API key and website domain.
    - You can get your API key here:
        1. Sign into the Control Panel.
        1. Click your name in the top right corner.
        1. Profile.
        1. Look for API key (you may need to reset it before it works).

### 2. Get themes

1. `cd` into wherever you want to edit a theme.
1. List the available themes: `thm list example-domain.com`
1. Download a theme to your local machine: `thm download 123@example-domain.com`
    - In this example, **123** is the ID number of the theme.

### 3. Edit themes

1. `cd` into the theme's directory.
1. Make it your remote editing/preview theme: `thm status edit`
    - Now you can see this theme in your browser, when you view the remote website (example-domain.com).
1. Edit the theme files.
    - Use any text editor, or move files into the `./files` folder to upload them.
1. Push the changes to the remote website:
    - For individual files: `thm push /full/path/to/file`
    - Automatically watch files: `thm push /full/path/to/file`
    - Upload all files: `thm sync up`

### 4. Publish a theme

- First, make sure you are previewing the development/staging theme. Use `thm status edit` to check it out.
- If everything looks good, then publish the theme to the live website: `thm status publish`

---

## Using `git`

You can use git to collaborate on multiple theme branches.

### Set up git

1. Download a theme: `thm download 123@example-website.com`
1. `cd 123`
    - Replace `123` with the theme name or ID.
1. Run `git init` to turn this theme into a git repo.
1. Add files, add origin, commit, and push to your remote repo.
    - You can find instructions at your git host of choice: GitHub, BitBucket, GitLab, etc.

### Working with git

Use the git branch workflow to safely edit multiple versions of your website's theme, and publish when ready.

**From inside a theme's directory:**

1. `git checkout -b name-of-branch`
1. Sync this theme to create it at the remote website: `creek-themes sync up`
1. Set this as the editing theme: `creek-themes status edit`
1. Work on the theme as usual.
    - Edit the theme files.
    - Use any git commands.
1. When ready, publish the new version.
    1. Merge the development branch into the public branch.
        - For example, merge `edit-the-thing` with `master`.
        - Or, you can just publish the new branch: `thm status publish`
    1. `thm sync up` to sync the changes to the remote website and publish them.


#### Tips

- Creek will add a "branch" label in the theme editor.
- Add `git_url: "http://github.com/example/example-repo` to your **theme.json** to keep track of this theme's official repository, so that collaborators know where to go.

---

## Commands

#### From a theme directory

Run these after `cd`-ing into the theme's directory.

`thm watch`
- Automatically watch for file changes and pushes them to the remote website.

`thm push path/to/file`
- Push a single file to the remote website.

`thm status edit`
- Edit and preview this theme in the browser. You must be logged in to see this theme.

`thm status publish`
- Publish this theme.

`thm status publish-managers|publish-hosts`
- Publish for all user types, just managers, or just hosts.

#### From any directory (not just themes)

You can use these commands globally.

`thm install`
- Configure theme editor environment. Adds files to: `~/.creek-themes/...`

`thm uninstall`
- Remove theme editor environment settings from: `~/.creek-themes/...`

`thm download 123@example-domain.com`
- download the theme folder.

`thm list example-domain.com`
- list all of the themes at a domain.

`thm add-key example-domain.com key-goes-here`
- Add a new API key to your user settings for a domain.

`thm get-keys`
- returns a list of all stored API keys in JSON format from your user settings.

`thm get-key example-domain.com`
- gets the stored API key for a domain from your user settings.

---

## Random tips

### Installing Node.js

#### On Windows

- You can use the Windows command prompt to run these same commands. It works the same way Mac, Windows, and Linux.

- A quick way to get started is to shift + right click on your themes folder and select "Open in Command Prompt".
