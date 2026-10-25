import { existsSync, mkdirSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { execSync } from 'node:child_process';

const ENGINE_DIR = join(process.cwd(), 'tools', 'audio-engine');
if (!existsSync(ENGINE_DIR)) mkdirSync(ENGINE_DIR, { recursive: true });

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`[skip] Already exists: ${destPath}`);
    return;
  }
  console.log(`Downloading ${url} -> ${destPath}...`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  const fileStream = createWriteStream(destPath);
  await pipeline(Readable.fromWeb(res.body), fileStream);
  console.log(`✓ Saved: ${destPath}`);
}

async function main() {
  const piperZip = join(ENGINE_DIR, 'piper_windows_amd64.zip');
  const piperExe = join(ENGINE_DIR, 'piper', 'piper.exe');
  const piperUrl = 'https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip';

  await downloadFile(piperUrl, piperZip);

  if (!existsSync(piperExe)) {
    console.log('Extracting piper_windows_amd64.zip...');
    // Use PowerShell Expand-Archive
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${piperZip}' -DestinationPath '${ENGINE_DIR}' -Force"`, { stdio: 'inherit' });
  }

  const modelOnnx = join(ENGINE_DIR, 'es_ES-davefx-medium.onnx');
  const modelJson = join(ENGINE_DIR, 'es_ES-davefx-medium.onnx.json');

  const onnxUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx';
  const jsonUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx.json';

  await downloadFile(jsonUrl, modelJson);
  await downloadFile(onnxUrl, modelOnnx);

  console.log('\nTesting piper execution...');
  const testWav = join(ENGINE_DIR, 'test.wav');
  execSync(`cmd.exe /c "echo Hola mundo | \\"${piperExe}\\" --model \\"${modelOnnx}\\" --output_file \\"${testWav}\\""`, { stdio: 'inherit' });

  if (existsSync(testWav)) {
    console.log(`🎉 Piper engine ready and verified! Generated: ${testWav}`);
  } else {
    console.error('❌ Failed to produce test.wav');
  }
}

main().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
