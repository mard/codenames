# Development

Based upon [these](https://github.com/microsoft/azure-devops-extension-hot-reload-and-debug) and [these](https://devblogs.microsoft.com/devops/streamlining-azure-devops-extension-development/) instructions.

* [Visual Studio Code](https://code.visualstudio.com/)
* [Mozilla Firefox](https://www.mozilla.org/pl/firefox/) (because Visual Studio Code Debugger for Chrome extension [doesn't support IFrames yet](https://github.com/microsoft/vscode-chrome-debug/issues/786))
* [Debugger for Firefox Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug)
* [Node.js](https://nodejs.org) and some packages:
  * [tfx-cli](https://www.npmjs.com/package/tfx-cli) `npm install -g tfx-cli`
  * [webpack](https://www.npmjs.com/package/webpack) `npm install -g webpack`
  * [webpack-cli](https://www.npmjs.com/package/webpack-cli) `npm install -g webpack-cli`
  * [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) `npm install -g webpack-dev-server`

## Setting up local development environment

### How it works

A local environment consists only of webpack development web server where compiled extension is hosted, a web browser and IDE. Installing a whole local instance of VSTS or Azure DevOps is not required. All of it just works only because development versions of extensions contain references to resources hosted on a local web server.

More importantly, they support hot reloading and all changes are applied immediately, without reinstalling or relaunching the server.

### First time setup: publishing and configuring the extension

First of all, compile the extension. Run `npm install` to install required node modules, then `npm run compile`.

Go to your [Azure DevOps](https://dev.azure.com/) organization, then generate a new [Azure DevOps Personal Access Token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops). Make sure that your token has its access set to **All accessible organizations** and is within **Marketplace (Publish)** scope as well.

Now you're ready to publish your development extension. Log in into your Azure DevOps organization using `tfx login` command where you will be asked to authenticate in keyboard-interactive mode.

``` console
$ tfx login

TFS Cross Platform Command Line Interface v0.7.9
Copyright Microsoft Corporation
> Service URL: https://dev.azure.com/<your account name>
> Personal access token: <token>
Logged in successfully
```

You can also make use of `--service-url` and `--token` parameters. Type `tfx login --help` for more information.

Now you're able to deploy your extension for the first time. `npm run publish:dev`
 
``` console
$ tfx extension publish --manifest-globs azure-devops-extension.json --overrides-file configs/dev.json --token <token>

TFS Cross Platform Command Line Interface v0.7.9
Copyright Microsoft Corporation
Checking if this extension is already published
It isn't, create a new extension.

== Extension Validation In Progress ==
This should take only a few seconds, but in some cases may take a bit longer. You can choose to exit (Ctrl-C) if you don't want to wait. To get the validation status, you may run the command below. If you don't want TFX to wait for validation, use the --no-wait-validation parameter. This extension will be available after validation is successful.

tfx extension isvalid --publisher mard --extension-id codenames-dev --version 0.0.1 --service-url https://marketplace.visualstudio.com/ --token <your PAT>

=== Completed operation: publish extension ===
 - Packaging: <path>\mard.codenames-dev-0.0.1.vsix
 - Publishing: success
 - Sharing: not shared (use --share-with to share)
```

Navigate to your [Marketplace publishing management page](https://marketplace.visualstudio.com/manage/publishers).

Right click on your development extension and share it within your organization (alternatively, you can publish your extension with --share-with parameter as indicated above).

Right click on your development extension and click *View Extension*, click *Get it free* button and proceed with the instructions to install it within your organization.

In [your Azure DevOps organization](https://dev.azure.com), click *Organization settings* on bottom left of your screen. Go to *Process*, and add the control to the desired work item types.

### Launch and Debug

Compile and run the local development web server with your compiled extension with `webpack-dev-server --mode development` command. You can also run `npm run start:dev` to do both things at the same time.

Start `Launch Firefox` debug profile in Visual Studio Code. You will be shown `https://localhost:3000/` development server root page. In this window, log in to the DevOps organization where you configured installed the extension and you're ready to debug from inside Visual Studio Code.

### Publishing production extension

You will need to be approved publisher by the Microsoft support first. More information [here](https://docs.microsoft.com/en-us/azure/devops/extend/publish/publicize).

If you're an approved publisher, you will be able to use `npm run publish` command.

## Gotchas & Caveats

* Remember to change/override id and publisher of your extension.
* Your development extensions are not accessible if you're not authorized in DevOps. You need to log in in order to debug.
* Recent changes to Firefox made it really difficult to add exception for the `https` site with self signed certificates. Consider change to `http` in webpack configuration and for development mode config.
* Extension manifest is taken from the installed extension, not from local environment. That means if you're relying on local development, you need to publish your extension every time you make breaking changes to your manifest, such as paths in contribution properties.
