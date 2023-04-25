const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');

// Define a list of applications and their download URLs
const apps = {
  'brave-browser': 'https://link-to-brave-browser-download',
  'google-chrome': 'https://link-to-google-chrome-download',
  'telegram': 'https://link-to-telegram-download',
  'whatsapp': 'https://link-to-whatsapp-download',
  'openshot': 'https://github.com/OpenShot/openshot-qt/releases/download/v3.1.1/OpenShot-v3.1.1-x86_64.dmg',
/*
node app.js openshot

'homebrew': 'https://link-to-app-download',
'open': 'https://link-to-app-download',
 'app': 'https://link-to-app-download',
 'app': 'https://link-to-app-download',
 'app': 'https://link-to-app-download',
 'app': 'https://link-to-app-download',
*/
 

  // Add more applications here...
};

// Set up command line arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <appName> [options]')
  .command('appName', 'Name of the application to download', {
    appName: {
      description: 'The application name',
      alias: 'a',
      type: 'string',
    },
  })
  .option('output', {
    alias: 'o',
    description: 'Output directory',
    type: 'string',
    default: '.',
  })
  .help()
  .alias('help', 'h').argv;

// Function to download a file
const downloadFile = async (url, outputPath) => {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Main function to handle the download
const main = async () => {
  const appName = argv.appName;
  const outputDir = argv.output;

  if (!apps[appName]) {
    console.error(`Application not found: ${appName}`);
    process.exit(1);
  }

  const url = apps[appName];
  const outputPath = path.join(outputDir, `${appName}.exe`); // Change the file extension if needed

  try {
    console.log(`Downloading ${appName}...`);
    await downloadFile(url, outputPath);
    console.log(`Downloaded ${appName} to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to download ${appName}:`, error.message);
  }
};

main();
