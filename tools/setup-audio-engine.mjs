import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const ENGINE_DIR = join(process.cwd(), 'tools', 'audio-engine');
if (!existsSync(ENGINE_DIR)) mkdirSync(ENGINE_DIR, { recursive: true });

function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`[skip] Already exists: ${destPath}`);
    return;
  }
  console.log(`Downloading ${url} -> ${destPath}...`);
  execSync(`curl -L --fail --silent --show-error "${url}" -o "${destPath}"`, { stdio: 'inherit' });
  console.log(`✓ Saved: ${destPath}`);
}

async function main() {
  const isWin = process.platform === 'win32';
  const piperBin = join(ENGINE_DIR, 'piper', isWin ? 'piper.exe' : 'piper');

  if (isWin) {
    const piperZip = join(ENGINE_DIR, 'piper_windows_amd64.zip');
    const piperUrl = 'https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip';
    downloadFile(piperUrl, piperZip);
    if (!existsSync(piperBin)) {
      console.log('Extracting piper_windows_amd64.zip...');
      execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${piperZip}' -DestinationPath '${ENGINE_DIR}' -Force"`, { stdio: 'inherit' });
    }
  } else {
    const piperTar = join(ENGINE_DIR, 'piper_linux_x86_64.tar.gz');
    const piperUrl = 'https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz';
    downloadFile(piperUrl, piperTar);
    if (!existsSync(piperBin)) {
      console.log('Extracting piper_linux_x86_64.tar.gz...');
      execSync(`tar -xzf "${piperTar}" -C "${ENGINE_DIR}"`, { stdio: 'inherit' });
    }
  }

  const modelOnnx = join(ENGINE_DIR, 'es_ES-davefx-medium.onnx');
  const modelJson = join(ENGINE_DIR, 'es_ES-davefx-medium.onnx.json');

  const onnxUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx';
  const jsonUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx.json';

  downloadFile(jsonUrl, modelJson);
  downloadFile(onnxUrl, modelOnnx);

  console.log('\nTesting piper execution...');
  const testWav = join(ENGINE_DIR, 'test.wav');
  const res = spawnSync(piperBin, ['--model', modelOnnx, '--output_file', testWav], {
    input: 'Hola, me llamo Omar.\n',
    encoding: 'utf8',
  });
  if (res.status !== 0) {
    throw new Error(`Piper exited with ${res.status}: ${res.stderr}`);
  }

  if (existsSync(testWav)) {
    console.log(`🎉 Piper engine ready and verified! Generated: ${testWav}`);
  } else {
    console.error('❌ Failed to produce test.wav');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});

