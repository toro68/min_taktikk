#!/usr/bin/env node
/**
 * Regex inspection script for Football Animator
 *
 * Usage: node regex-analyze.js [pattern] [--context N] [--root PATH]
 * Example: node regex-analyze.js "console\.log" --context 2
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node regex-analyze.js <pattern> [--context N] [--root PATH]');
  process.exit(1);
}

let pattern = args[0];
let context = 1;
let root = process.cwd();

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--context' && args[i + 1]) {
    context = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--root' && args[i + 1]) {
    root = path.resolve(args[i + 1]);
    i++;
  }
}

if (!fs.existsSync(root)) {
  console.error(`Root path does not exist: ${root}`);
  process.exit(1);
}

const files = spawnSync('rg', ['--files'], { cwd: root });
if (files.status !== 0) {
  console.error('Failed to list files with ripgrep (rg). Make sure rg is installed.');
  process.exit(1);
}

const fileList = files.stdout.toString().trim().split('\n').filter(Boolean);
const results = [];

fileList.forEach(file => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const regex = new RegExp(pattern, 'i');

  lines.forEach((line, index) => {
    if (regex.test(line)) {
      const start = Math.max(0, index - context);
      const end = Math.min(lines.length, index + context + 1);
      results.push({
        file: filePath,
        line: index + 1,
        snippet: lines.slice(start, end).join('\n')
      });
    }
  });
});

if (results.length === 0) {
  console.log(`No matches found for pattern: ${pattern}`);
  process.exit(0);
}

results.forEach(result => {
  console.log(`\n=== ${result.file}:${result.line} ===`);
  console.log(result.snippet);
});
