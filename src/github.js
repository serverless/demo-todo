const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawnSync } = require('child_process')
const _ = require('lodash')

const { GITHUB_TOKEN, GITHUB_USERNAME, GITHUB_EMAIL } = process.env
// leaving this without https:// in order to reuse it when adding the remote
const gitRepositoryURL = 'github.com/serverless/demo-todo.git'
const repositoryName = 'demo-todo'

function runCommand (commandString, options) {
  const [command, ...args] = commandString.match(/(".*?")|(\S+)/g)
  const cmd = spawnSync(command, args, options)

  if (cmd.status !== 0) {
    const errorString = cmd.stderr.toString()
    throw new Error(
      `Git command failed
      ${commandString}
      ${errorString}`
    )
  }
}


module.exports.deploy = async function () {
  // Fix issue with lambda-git and node > 8
  const bug = spawnSync("ln", ["-s", "/usr/lib64/libpcre.so.1.2.0", "/tmp/git/usr/lib64/libpcre.so.0"])

  // change the cwd to /tmp as its the only writable directory we have access to
  process.chdir('/tmp')
  // clone the repository and set it as the cwd
  // sadly, clone doesn't support --porcelain
  runCommand(`git clone --quiet https://${gitRepositoryURL}`)
  process.chdir(path.join(process.cwd(), repositoryName))

  const gitBranch = process.env.STAGE === 'prod' ? 'master' : 'dev'
  runCommand(`git checkout ${gitBranch}`)
  
  const slsFile = path.join(process.cwd(), 'serverless.yml')
  const slsYml = fs.readFileSync(slsFile)

  const rate = _.random(10) + 3

  fs.writeFileSync(slsFile, slsYml.toString().replace(/rate\(\d minutes\)/gm, `rate(${rate} minutes)`))

  // update local git config with email and username (required)
  runCommand(`git config --local user.email ${GITHUB_EMAIL}`)
  runCommand(`git config --local user.name ${GITHUB_USERNAME}`)
  runCommand('git add .')
  runCommand('git commit -m "commit by :robot:"')
  runCommand(`git push --porcelain --set-upstream origin ${gitBranch}`)  
}