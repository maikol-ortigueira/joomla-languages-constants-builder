const {
    getExtension, targetLangs, asyncForEach, motherLanguage, fixLanguageConstant, getConstanteSufix, appendToFile
} = require('./utils');
const isoCountryLanguage = require('iso-countries-languages');
const motherIso = motherLanguage.split('-')[0];

const { extPath, langs, getText, trans } = require("./utils");
const extType = __filename.split('/').pop().split('.')[0];

const input = require('input');
const copy = require('clipboardy').writeSync;
const fs = require('fs');
const isoCountriesLanguages = require('iso-countries-languages');

async function main() {
    const textSelecClient = await trans('Select client', motherIso, 'en');
    const client = await input.select(textSelecClient, ['admin', 'site']);
    const ext = await getExtension(extType);
    const textToTranslate = await trans('Text to be translated', motherIso, 'en');
    const text = await getText(textToTranslate);

    const langs = targetLangs();
    const langPath = `${extPath}/${ext['type']}/${ext['extension']}/${client}/language`;

    var data = [];
    data.push({language: motherLanguage, text: text, file: `${langPath}/${motherLanguage}/${motherLanguage}.com_${ext['extension']}.ini`});

    const start = async () => {
        await asyncForEach(langs, async (lang) => {
            var target = lang.target;
            
            var isoLang = isoCountriesLanguages.getLanguage('en', target);
            var selLangV = await trans(`${isoLang} version`, motherIso, 'en');

            const translated = await trans(text, target);
            const text2 = await getText(selLangV, translated);
            const file = `${langPath}/${lang.language}/${lang.language}.com_${ext['extension']}.ini`;
            
            data.push({language: lang.language, text: translated, file: file});
        });
        var inputConst = await trans('Constat value', motherIso, 'en');
        const langString = await getText(inputConst).then(
            async langStr => {
                const constantType = await getConstanteSufix();
                langStr = fixLanguageConstant(langStr, ext['extension'], 'com', client, constantType);

                copy(langStr);

                data.forEach(d => {
                    d.constant = langStr;
                })
            }
        );

        return data;
    }

    start().then(data => {
        data.forEach(lang => {
            appendToFile(lang)
        })
    });
}

main();
