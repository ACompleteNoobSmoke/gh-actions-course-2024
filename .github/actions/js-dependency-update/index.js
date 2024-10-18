const core = require('@actions/core');

async function run() {
    core.info("I am a custom JS action\n")
    const branchName = core.getInput("base-branch");
    const targetName = core.getInput("target-branch");
    const workingDirectory = core.getInput("working-directory");
    const debug = core.getBooleanInput("debug");

    console.log(`Base Branch: ${branchName}`);
    console.log(`Target Branch: ${targetName}`);
    console.log(`Working Directory: ${workingDirectory}`);
    console.log(`Debug: ${debug}`);

}

run();