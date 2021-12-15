const fs = require("fs");
const idl = require("./target/idl/solana_app.json");
fs.writeFileSync("./app/src/idl/idl.json", JSON.stringify(idl));