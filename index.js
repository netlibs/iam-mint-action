const homedir = require('os').homedir();
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const awsDir = `${homedir}/.aws`;


async function main() {

  console.log("writting to", awsDir)

  if (!fs.existsSync(awsDir)){
    fs.mkdirSync(awsDir);
  }

  await fs.promises.writeFile(`${awsDir}/config`, "[default]\nregion=us-west-2\n");



  const token = core.getInput('token');
  const actor = core.getInput('endpoint');
  const endpoint = core.getInput('endpoint');
  const project = core.getInput('project');


  const res = await fetch(endpoint, { 
    method: 'post', 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, project, actor })
  });

  if (res.status != 200) 
    throw new Error(`failed to mint token`);

  const body = await res.json();

  const credentials = body.credentials;
  credentials.Version = 1;

  await fs.promises.writeFile(`${awsDir}/credentials`, `[default]\ncredential_process = /bin/echo '${JSON.stringify(credentials)}'\n`);

}

main().then(console.log).catch(e => core.setFailed(e.message));


