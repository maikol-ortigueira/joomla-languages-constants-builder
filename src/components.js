const {
    getExtension,
    targetLangs,
    asyncForEach,
    motherLanguage,
    fixLanguageConstant,
    getConstanteSufix,
    appendToFile
} = require('./utils');

const {
    extPath,
    getText,
    trans
} = require("./utils");
const copy = require('clipboardy').writeSync;
const input = require('input');
const isoCountriesLanguages = require('iso-countries-languages');
// The config languages
const langs = targetLangs();

// The user language
const motherIso = motherLanguage.split('-')[0];
// This extension type
const extType = 'components';

// The main function
async function main() {
    // The translated input labels
    const textSelecClient = await trans('Select client', motherIso, 'en');
    const textToTranslate = await trans('The String Value', motherIso, 'en');
    var inputConst = await trans('Constat value', motherIso, 'en');

    // Select the client
    const client = await input.select(textSelecClient, ['admin', 'site']);
    // Get the extension name
    const ext = await getExtension(extType);
    // Get the constant value
    const text = await getText(textToTranslate);

    // Get the extension language path
    const langPath = `${extPath}/${ext['type']}/${ext['extension']}/${client}/language`;

    var data = [];
    // Push the mother language data
    data.push({
        language: motherLanguage,
        text: text,
        file: `${langPath}/${motherLanguage}/${motherLanguage}.com_${ext['extension']}.ini`
    });

    // Method to translate other languages
    const start = async () => {
        // Only if you need more than one language
        if (langs.length > 0) {
            await asyncForEach(langs, async (lang) => {
                // The iso target language
                const target = lang.target;
                const isoLang = isoCountriesLanguages.getLanguage('en', target);
                const selLangV = await trans(`${isoLang} version`, motherIso, 'en');

                // The extension language file
                const file = `${langPath}/${lang.language}/${lang.language}.com_${ext['extension']}.ini`;
                // Translate the string
                const translated = await trans(text, target);
                const text2 = await getText(selLangV, translated);

                // Push the language data
                data.push({
                    language: lang.language,
                    text: text2,
                    file: file
                });
            });
        }
        // Get the constant value from user
        const langString = await getText(inputConst).then(
            async langStr => {
                // Get the constant prefix from user
                const constantType = await getConstanteSufix();
                // Fix the constant with obtained data
                langStr = fixLanguageConstant(langStr, ext['extension'], 'com', client, constantType);

                // Copy the constant value to the clipboard
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
            // Append data to language file
            appendToFile(lang)
        })
        console.log('\n\nConstant Value: \x1b[1m\x1b[33m%s\x1b[0m', data[0].constant, '\n\n');
    });
}

main();