const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

const spawn = require("spawndamnit")

const { organization, folderNameToPackageName } = require('./constants')

async function runSpawn(command, args) {
    // log the output of the command in terminal
    const spawnOptions = { stdio: 'inherit' }

    let result = await spawn(command, args, spawnOptions)
    if (result.code !== 0) {
        throw new Error(`${args.join(' ')} failed`)
    }
}

module.exports = async ({ github, context, core }) => {
    const package = 'contracts'
    const packageName = folderNameToPackageName[package];

    if (packageName === undefined) {
        throw new Error("package not found");
    }

    await exec("npx changeset status --output=temp.js")

    const contents = fs.readFileSync("temp.js", { encoding: 'utf8' })
    const releases = JSON.parse(contents).releases;

    const release = releases.filter(item => item.name == `${organization}/${packageName}`)

    /// Defensive assertion. SHOULD NOT BE REACHED
    if (release.length != 1) {
        throw new Error(`The status doesn't contain only 1 release for ${packageName}`)
    }

    const parts = release[0].newVersion.split('.');

    const releaseBranch = `release-${package}-v${parts[0]}.${parts[1]}`

    await runSpawn('git', ['checkout', '-b', releaseBranch]);
    await runSpawn('npx', ['changeset', 'pre', 'enter', 'alpha'])
    await runSpawn('git', ["add", "."])
    await runSpawn('git', ["commit", "-m", "Start release candidate"])
    await runSpawn('git', ["push", "origin", releaseBranch])

    core.setOutput('branch', releaseBranch)
}
