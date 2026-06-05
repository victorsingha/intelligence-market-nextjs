const { spawn } = require('child_process');
const child = spawn('npx.cmd', ['next', 'dev', '-H', 'localhost'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

const filter = (data) => {
  const lines = data.toString().split('\n').filter(line => !line.includes('Network:'));
  if (lines.length) process.stdout.write(lines.join('\n'));
};

child.stdout.on('data', filter);
child.stderr.on('data', filter);

child.on('exit', (code) => process.exit(code));
