const { createClient } = require('../');
window.addEventListener('load', start);

async function start () {
  const { E, getBootstrap } = createClient('ws://localhost:8088');
  const value = await E(getBootstrap()).greet();
  content.innerText = value;
}

