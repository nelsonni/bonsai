# Bonsai IDE
Bonsai is a cross platform IDE aimed at research into Programming as Problem-Solving, and cards-based user interfaces. Bonsai is a Japenese art form that uses trees grown in containers as aesthetic expressions of wabi-sabi; the acceptance of transience and imperfection. Wabi-sabi encompasses the concept of beauty as "imperfect, impermanent, and incomplete". Bonsai IDE allows users to gather transient knowledge across multiple sources, build and rebuild software, and engender knowledge and awareness in a workspace that is constantly changing.

# Build Instructions
Packaging Electron apps for release is platform-specific and requires the use of additional scripts.
1. Run the following command to install `electron-packager` such that the package will appear in `devDependencies`: 
* `npm install electron-packager --save-dev`
  
2. Run the following command to install `electron` such that the package will appear in `devDependencies`:
* `npm install electron --save-dev`

3. Run the following command from within the project directory:
* `electron-packager . bonsai --platform=all --arch=x64`

<b>Note</b>: For the `electron-packager` command, the `--platform` can be set to `all`, or one or more of: `darwin` for MacOS, `linux` for Linux, `win32` for Windows, or `mas`. Possibly need to include the `--overwrite` command if previous builds have already been generated.

Contributors: Nicholas Nelson (@nelsonni), 
