const {
    getExtension, targetLangs, asyncForEach, motherLanguage, fixLanguageConstant, getConstanteSufix, appendToFile
} = require('./utils');

const { extPath, getText, trans } = require("./utils");
const input = require('input');
const copy = require('clipboardy').writeSync;
const fs = require('fs');
const isoCountriesLanguages = require('iso-countries-languages');
// The config languages
const langs = targetLangs();

// The user language
const motherIso = motherLanguage.split('-')[0];
// This filename
const extType = __filename.split('/').pop().split('.')[0];

// The main function
async function main() {
    // The translated input label strings
    const textToTranslate = await trans('The text to be translated', motherIso, 'en');
    const inputConst = await trans("The constant's value", motherIso, 'en');
    
    // Get the extension name
    const ext = await getExtension(extType);
    // Get the text to be translated
    const text = await getText(textToTranslate, 'Hola Mundo');

    // Get the extension language path
    const langPath = `${extPath}/${ext['type']}/${ext['group']}/${ext['extension']}/language`;
    
    var data = [];
    // Push the mother languages data
    data.push({language: motherLanguage, text: text, file: `${langPath}/${motherLanguage}/${motherLanguage}.plg_${ext['group']}_${ext['extension']}.ini`});
    
    // Start the translations
    const start = async () => {
        await asyncForEach(langs, async (lang) => {
            // The iso target language
            const target = lang.target;
            const isoLang = isoCountriesLanguages.getLanguage('en', target);
            const selLangV = await trans(`${isoLang} version`, motherIso, 'en');

            // The extension language file
            const file = `${langPath}/${lang.language}/${lang.language}.plg_${ext['group']}_${ext['extension']}.ini`;
            // Translate the string
            const translated = await trans(text, target);
            const text2 = await getText(selLangV, translated);
            
            // Push the language data
            data.push({language: lang.language, text: translated, file: file});
        });

        // Get the constant value from user
        const langString = await getText(inputConst).then(
            async langStr => {
                // Get the constant sufix from user
                const constantType = await getConstanteSufix();
                // Fix the constante with the obtained data
                langStr = fixLanguageConstant(langStr, ext['extension'], 'plg', ext['group'], constantType);

                // Push the constant value to clipboard
                copy(langStr);

                // Push the constant value to the language object
                data.forEach(d => {
                    d.constant = langStr;
                })
            }
        );

        return data;
    }

    start().then(data => {
        data.forEach(lang => {
            // Append the data to language file
            appendToFile(lang)
        })
    });
}

main();
