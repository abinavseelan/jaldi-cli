const exec = require('child_process').exec;

exec('which git', (err, stdout, stderr) => {
    if (err) {
        console.error("😔  Could not find local git installation!");
        console.log("\nTry installing git or manually downloading the starter repo from https://github.com/abinavseelan/React-Express-Node-Starter.");
    } else {
        console.log("🎉  Local git installation found!");
    }
});