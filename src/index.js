const {
    getExtensionType, getExtensions
} = require('./utils');
const clear = require('clear');

// Clear the terminal
clear();

// Select the extension type and require selected type
getExtensionType().then( extType => {
    require(`./${extType}.js`);
});
