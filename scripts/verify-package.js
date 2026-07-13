'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const ruleDocsDirectory = path.join(projectRoot, 'docs', 'rules');
const expectedFiles = [
    'package.json',
    'README.md',
    'CHANGELOG.md',
    'lib/index.js',
    ...fs.readdirSync(ruleDocsDirectory)
        .filter((fileName) => fs.statSync(path.join(ruleDocsDirectory, fileName)).isFile())
        .map((fileName) => `docs/rules/${fileName}`),
];

function runPackDryRun() {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const output = execFileSync(npmCommand, ['pack', '--dry-run', '--json'], {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
    });

    const result = JSON.parse(output);

    assert(Array.isArray(result) && result.length === 1, 'npm pack returned an unexpected result.');
    assert(Array.isArray(result[0].files), 'npm pack did not return a file list.');

    return result[0].files.map((file) => file.path);
}

const publishedFiles = runPackDryRun();
const unexpectedFiles = publishedFiles.filter((filePath) => {
    return filePath !== 'package.json'
        && filePath !== 'README.md'
        && filePath !== 'CHANGELOG.md'
        && !filePath.startsWith('lib/')
        && !filePath.startsWith('docs/rules/');
});

assert.deepStrictEqual(unexpectedFiles, [], `Unexpected files in npm package:\n${unexpectedFiles.join('\n')}`);

const missingFiles = expectedFiles.filter((filePath) => !publishedFiles.includes(filePath));

assert.deepStrictEqual(missingFiles, [], `Required files missing from npm package:\n${missingFiles.join('\n')}`);

process.stdout.write(`Verified npm package contents (${publishedFiles.length} files).\n`);
