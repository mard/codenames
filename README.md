# Codenames

[![Build Status](https://dev.azure.com/mard-dev/codenames/_apis/build/status/mard.codenames?branchName=master)](https://dev.azure.com/mard-dev/codenames/_build/latest?definitionId=1&branchName=master) [![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/version/mard.codenames.svg)](https://marketplace.visualstudio.com/items?itemName=mard.codenames) ![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/mard.codenames)

Azure DevOps Extension for generating random code names for work items.

They can be used as an alternative to work item IDs or titles, that are more than often hard to remember.

![Codenames Showcase Animation](images/showcase.gif)

## How it works

This extension adds a work item control with a button that generates a code name, then it updates the field that was configured in custom control options.

Currently phrases are generated from a predefined pool of words. They were inspired by universally known things, beings and ideas, resulting in phrases that are fun and easy to remember.

## Usage

1. [Add a custom field to inherited process](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/add-custom-field?view=azure-devops#add-a-field).
2. [Add Codenames as a custom control](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/custom-controls-process?view=azure-devops#add-a-field-level-contribution-or-custom-control) to inherited process, then in options choose the custom field created in previous step.
3. Open the work item page, and click a button to update the field with generated phrase.

## Release notes

### 0.1.1

* Fix missing description for custom control selection dropdown
* Fix missing name for input parameter
* Add some words

### 0.1.0

* First published version
