const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function main() {

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

  console.log(body);

}

main().then(console.log).catch(e => core.setFailed(e.message));


