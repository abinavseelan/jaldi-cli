#!/usr/bin/env node
const exec = require('child_process').exec;
const config = require('./config');
const platform = require('os').platform();
console.log()

if (process.argv.length !== 3) {
    console.error("Usage: jaldi <path>");
    process.exit(1);
}

const path = process.argv[2];

function isNotInstalled(app) {
    let command = `which ${app}`;
    if (platform == 'win32') {
        command = `where ${app}`;
    }
    exec(command, (err, stdout, stderr) => {
        return Boolean(err)
    });
}

function commandToDelete(folder_path) {
    if (platform === 'win32') {
        return `rmdir /s /q ${folder_path}`;
    } else {
        return `rm -rf ${folder_path}`;
    }
}

function checkGit() {
    console.log('🔍  Checking for local git installation');

    return new Promise((resolve, reject) => {
        if (isNotInstalled('git')) {
            console.error("😔  Could not find local git installation!");
            console.log("\nTry installing git or manually downloading the starter repo from https://github.com/abinavseelan/React-Express-Node-Starter.");
            reject();
        } else {
            console.log("🎉  Local git installation found!");
            resolve();
        }
    });
}

function checkNpm() {
    console.log('🔍  Checking for local npm installation');

    return new Promise((resolve, reject) => {
        if (isNotInstalled('npm')) {
            console.error("😔  Could not find local npm installation!");
            console.log("\nTry installing npm or manually downloading the starter repo from https://github.com/abinavseelan/React-Express-Node-Starter.");
            reject();
        } else {
            console.log("🎉  Local npm installation found!");
            resolve();
        }
    })
}

function clone() {
    console.log("\n📦  Cloning starter project");

    return new Promise((resolve, reject) => {
        exec(`git clone ${config.default} ${path} && echo '✅  Done.'`, (err, stdout, stderr) => {
            if (err) {
                console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                console.log(`\n${stderr}`);

                reject();
            } else {
                console.log(stdout);

                resolve();
            }
        });
    })
}

function cleanUp() {
    console.log("💅  Tidying things up...");

    function changeDirectory() {
        return new Promise((resolve, reject) => {
            process.chdir(path);
            resolve();
        });
    };

    function removeGit() {
        return new Promise((resolve, reject) => {
            exec(commandToDelete(`"./.git"`), (err, stdout, stderr) => {
                if (err) {
                    console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                    console.log(`\n${stderr}`);

                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    function reinitGit() {
        return new Promise((resolve, reject) => {
            exec(`git init`, (err, stdout, stderr) => {
                if (err) {
                    console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                    console.log(`\n${stderr}`);

                    reject();
                } else {
                    console.log(stdout);

                    resolve();
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        changeDirectory()
            .then(removeGit)
            .then(reinitGit)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}

function installDep() {
    console.log("⬇️  Installing dependencies");

    return new Promise((resolve, reject) => {
        exec(`npm i`, (err, stdout, stderr) => {
            if (err) {
                console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                console.log(`\n${stderr}`);

                reject();
            } else {
                console.log(stdout);

                resolve();
            }
        });
    });
}

function makeInitialCommit() {
    function addFiles() {
        return new Promise((resolve, reject) => {
            exec('git add .', (err, stdout, stderr) => {
                if (err) {
                    console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                    console.log(`\n${stderr}`);

                    reject();
                } else {
                    console.log(stdout);

                    resolve();
                }
            })
        });
    }

    function makeCommit() {
        return new Promise((resolve, reject) => {
            exec('git commit -m "Initial Commit"', (err, stdout, stderr) => {
                if (err) {
                    console.log("\n😕  Oops. Something went wrong. Please check the error logs below and re-try the command.");

                    console.log(`\n${stderr}`);

                    reject();
                } else {
                    console.log(stdout);

                    resolve();
                }
            })
        });
    }

    return new Promise((resolve, reject) => {
        addFiles()
            .then(makeCommit)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}

checkGit()
    .then(checkNpm)
    .then(clone)
    .then(cleanUp)
    .then(installDep)
    .then(makeInitialCommit)
    .then(() => {
        console.log("🚀   All set up!");
        console.log(`\nIf there are any issues with the cloned starter project, please raise an issue at ${config.default}`);
    })
    .catch(() => {
        process.exit(1);
    });
