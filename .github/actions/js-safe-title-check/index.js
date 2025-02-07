const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');


const run = async () => {
    const prTitle = core.getInput('pr-title');
    if (!prTitle.includes('feature')) {
        core.setFailed(`PR-TITLE: ${prTitle}\nError: Does not fit format`);
    }
    console.log(`PR-Title: ${prTitle}\nMessage: Success`)
}

run();
