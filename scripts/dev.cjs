const { spawn } = require('child_process');
const child = spawn('npx.cmd', ['next', 'dev', '-H', 'localhost'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

child.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => {
    if (line.includes('Slow filesystem')) return false;
    if (line.includes('docs/app/guides/local-development')) return false;
    return true;
  });
  if (lines.length) process.stdout.write(lines.join('\n'));
});

child.stderr.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => {
    if (line.includes('Slow filesystem')) return false;
    if (line.includes('docs/app/guides/local-development')) return false;
    return true;
  });
  if (lines.length) process.stderr.write(lines.join('\n'));
});

child.on('exit', (code) => process.exit(code));
