# Joomla! language constants builder system

## What is this?
With this code I intend to help the joomla community in the development of extensions.
Joomla! has a powerful string translation system. The texts are stored in separate files depending on the language.
At the same time these files are grouped according to the client (front-end, back-end). For example, for a Joomla component that is intended to be displayed in two languages (English and Spanish), 6 files must be created with the translation strings, three for one language and another 3 for the other. Of these three, two correspond to the back-end and one to the front-end.
The translation strings are composed of a constant and its value.
The prefix of the constant varies depending on the type of extension (com for components, plg for plugins, etc...).
From the prefix, the name of the extension is added.... [see Joomla docs for more information](https://docs.joomla.org/Making_templates_translatable)
An example of a translation string would be:
COM_CONTENT_ADMIN_FIELD_USER_NAME_LBL="User name", where "COM_CONTENT_ADMIN_FIELD_USER_NAME_LBL" would be the constant and "User name" would be its value, in this case for english language
In short, if the strings are well organized the system works perfectly throughout the site.
This all sounds very good, but when it comes to generating the code it is a bit tedious to have to update all the language files as the constants are inserted in the code.
The usual thing is to program in one language (English) and update only one file, and once the development is finished create a new file for each of the languages you want to include in the project. This also has its disadvantages, since it often happens that some paragraphs of the project vary in meaning depending on the context.
For this reason I have created this code, and I hope you find it useful.

## How it works
For the package to work you must have nodejs installed on your computer, to do this you can follow the instructions on the [nodejs website](https://nodejs.org/en/).

First of all you must clone this repository to you local instalation.

Once the repository has been cloned, you must open a terminal in the main folder of the repository and run `npm install`. This will add all the needed dependencies to work.

Then you must configure the programming environment, indicating the folders in which our development extensions are located.
We must also know the types of extensions that our project consists of, with the name of each one.
We must have clear from the beginning the languages of which our project will consist and also which will be the main language.
We will indicate all this in the `config.json` file. You can rename the `config.json.dist` file to `config.json`.
Be careful, we must have created the files that will store the text strings of the translations for the languages indicated in the configuration file.
This file looks like:
```bash
{
    "extensionsPath": "the_extensions_path", // The path to your extensions
    "extConfFilepath": "the_extension_path", // The simple extension path
    "extConfFile": "extensions-config.json", // The name of the extension config file.
    "langs": ["en-GB", "es-ES"], // The project languages
    "motherLanguage": "es-ES" // The main language
}
```

The next file you need must be hosted inside the extension's folder. Here is an example file, just rename it from `extensions-config.json.dist` to `extensions-config.json` and save it in the extension folder.
Once there you must indicate in the file the extensions that make up your project.
```bash
{
    "components": ["content"],
    "plugins": {
        "content": ["foo"],
        "system": ["bar"]
    },
    "modules": {
        "site": ["foo", "bar"],
        "admin": ["foo"]
    },
    "packages": ["foo"]
}
```
If your project is composed of only one extension you can either remove the rest of the extensions or leave the an empty array (ex.: "packages": []), it's up to you.

## All installed and configured!, lets translate
If everything went well, all you have to do from now on is run 'npm start' every time you want to translate a text in your project.

You will get asked about your extension type (if more than one extension type), the extension name (if more than one extension per type), the text to be translated, then it will show you each translated string to confirm o replace it. The last question is about the constant composition.

Once all these questions have been answered, the text strings will be automatically stored in their corresponding files and the value of the constant will be copied to the clipboard. You can now just paste it into the code (ctrl+v or shift+ctrl+v).
