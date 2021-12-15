const anchor = require("@project-serum/anchor");

module.exports = async function (provider) {
    // Configure Client to use the Provider
    anchor.setProvider(provider);
}
