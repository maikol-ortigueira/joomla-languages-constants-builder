const {
    getExtension, targetLangs, asyncForEach, motherLanguage, fixLanguageConstant, getConstanteSufix, appendToFile
} = require('./utils');

const { extPath, getText, trans } = require("./utils");
const copy = require('clipboardy').writeSync;
const isoCountriesLanguages = require('iso-countries-languages');
// The config languages
const langs = targetLangs();

// The user language
const motherIso = motherLanguage.split('-')[0];
// This filename
const extType = 'package';

// The main function
async function main() {
    // The translated input label strings
    const textToTranslate = await trans('The String Value', motherIso, 'en');
    const inputConst = await trans("The constant's value", motherIso, 'en');
    
    // Get the extension name
    const ext = await getExtension(extType);
    // Get The String Value
    const text = await getText(textToTranslate);

    // Get the extension language path
    const langPath = `${extPath}/language`;
    
    var data = [];
    // Push the mother languages data
    data.push({language: motherLanguage, text: text, file: `${langPath}/${motherLanguage}/${motherLanguage}.pkg_${ext['extension']}.sys.ini`});
    
    // Start the translations
    const start = async () => {
        // Only if you need more than one language
        if (langs.length > 0) {
            await asyncForEach(langs, async (lang) => {
                // The iso target language
                const target = lang.target;
                const isoLang = isoCountriesLanguages.getLanguage('en', target);
                const selLangV = await trans(`${isoLang} version`, motherIso, 'en');
                
                // The extension language file
                const file = `${langPath}/${lang.language}/${lang.language}.pkg_${ext['extension']}.sys.ini`;
                // Translate the string
                const translated = await trans(text, target);
                const text2 = await getText(selLangV, translated);
                
                // Push the language data
                data.push({language: lang.language, text: translated, file: file});
            });
        }
            
        // Get the constant value from user
        const langString = await getText(inputConst).then(
            async langStr => {
                // Get the constant sufix from user
                const constantType = await getConstanteSufix();
                // Fix the constante with the obtained data
                langStr = fixLanguageConstant(langStr, ext['extension'], 'pkg', ext['group'], constantType);

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
        console.log('\n\nConstant Value: \x1b[1m\x1b[33m%s\x1b[0m', data[0].constant, '\n\n');
    });
}

main();
