import { Updater } from 'tuf-js';

import fs from 'fs';
import path from 'path';

const target = 'ctfe.pub';

const metadataBaseUrl = 'https://sigstore-tuf-root.storage.googleapis.com';
const metadataDir = './metadata';
const targetDir = './targets';
const targetBaseUrl =
  'https://sigstore-tuf-root.storage.googleapis.com/targets';

function initDir() {
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
  }

  if (!fs.existsSync(path.join(metadataDir, 'root.json'))) {
    fs.copyFileSync('./1.root.json', path.join(metadataDir, 'root.json'));
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
}

async function downloadTarget() {
  const updater = new Updater({
    metadataBaseUrl,
    metadataDir,
    targetDir,
    targetBaseUrl,
  });
  await updater.refresh();
  const targetInfo = await updater.getTargetInfo(target);

  if (!targetInfo) {
    console.log(`Target ${target} doesn't exist`);
    return;
  }
  const targetPath = await updater.findCachedTarget(targetInfo);
  if (targetPath) {
    console.log(`Target ${target} is cached at ${targetPath}`);
    return;
  }

  const targetFile = await updater.downloadTarget(targetInfo);
  console.log(`Target ${target} downloaded to ${targetFile}`);
}

initDir();
downloadTarget();
