const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

const spawn = require("spawndamnit")

const { organization, folderNameToPackageName } = require('./scripts/release/constants')

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

    const spawnOptions = { stdio: 'inherit' }

    const checkoutCommand = await spawn('git', ['checkout', '-b', releaseBranch], spawnOptions)
    if (checkoutCommand.code !== 0) {
        throw new Error("Problem When checking out branch")
    }

    await exec('npx changeset pre enter alpha')
    await spawn("git", ["add", "."], spawnOptions);
    await spawn(
        "git",
        ["commit", "-m", "Start release candidate"],
        spawnOptions
    );

    const pushCommand = await spawn(
        "git",
        ["push", "origin", releaseBranch],
        spawnOptions
    );

    if (pushCommand.code !== 0) {
        throw new Error(`Cant push to the ${releaseBranch}`)
    }

    core.setOutput('branch', releaseBranch)
}
