const core = require('@actions/core');
const exec = require('@actions/exec')

async function run() {
    core.info("I am a custom JS action\n")
    var regex =  /^[a-zA-Z0-9.-]+$/;
    const branchName = core.getInput("base-branch");
    const targetName = core.getInput("target-branch");
    const workingDirectory = core.getInput("working-directory");
    const debug = core.getBooleanInput("debug");
    const branchValidation = validation(branchName, regex);
    const targetValidation = validation(targetName, regex);
    const directoryValidation = validation(workingDirectory, regex);

    if (branchValidation || targetValidation || directoryValidation){
        core.setFailed("Validation Failed");
        return;
    }
        


    console.log(`Base Branch: ${branchName}`);
    console.log(`Target Branch: ${targetName}`);
    console.log(`Working Directory: ${workingDirectory}`);
    console.log(`Debug: ${debug}`);

    const gitStatus = await exec.getExecOutput(
        'git status -s package*.json',
        [],
        {
          ...commonExecOpts,
        }
      );
    
      let updatesAvailable = false;
    
      if (gitStatus.stdout.length > 0) {
        updatesAvailable = true;
    
        logger.debug('There are updates available!');
        logger.debug('Setting up git');
        await setupGit();
    
        logger.debug('Committing and pushing package*.json changes');
        await exec.exec(`git checkout -b ${headBranch}`, [], {
          ...commonExecOpts,
        });
        await exec.exec(`git add package.json package-lock.json`, [], {
          ...commonExecOpts,
        });
        await exec.exec(`git commit -m "chore: update dependencies`, [], {
          ...commonExecOpts,
        });
        await exec.exec(`git push -u origin ${headBranch} --force`, [], {
          ...commonExecOpts,
        });
    
        logger.debug('Fetching octokit API');
        const octokit = github.getOctokit(ghToken);
    
        try {
          logger.debug(`Creating PR using head branch ${headBranch}`);
    
          await octokit.rest.pulls.create({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            title: `Update NPM dependencies`,
            body: `This pull request updates NPM packages`,
            base: baseBranch,
            head: headBranch,
          });
        } catch (e) {
          logger.error(
            'Something went wrong while creating the PR. Check logs below.'
          );
          core.setFailed(e.message);
          logger.error(e);
        }
      } else {
        logger.info('No updates at this point in time.');
      }
}

const validation = (branch, regex) => {
    return regex.test(branch);
}

run();