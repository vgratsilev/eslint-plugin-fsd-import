'use strict';

const path = require('path');

function normalizeSeparators(value) {
    if (typeof value !== 'string') {
        return null;
    }

    return value.replace(/\\/g, '/');
}

function isPathRelative(value) {
    const normalizedValue = normalizeSeparators(value);

    return normalizedValue === '.' || normalizedValue === '..'
        || normalizedValue?.startsWith('./') || normalizedValue?.startsWith('../');
}

function getPathSegments(value) {
    const normalizedValue = normalizeSeparators(value);

    if (normalizedValue === null) {
        return null;
    }

    return normalizedValue.split('/').filter(Boolean);
}

function getImportPrefix(value, { alias = '', rootDir = 'src' } = {}) {
    const normalizedValue = normalizeSeparators(value);
    const withoutAlias = stripAlias(normalizedValue, alias);
    const normalizedAlias = normalizeSeparators(alias)?.replace(/\/+$/, '');
    const normalizedRootDir = normalizeSeparators(rootDir)?.replace(/^\/+|\/+$/g, '');
    const aliasPrefix = normalizedAlias && withoutAlias !== normalizedValue
        ? `${normalizedAlias}/`
        : '';
    const rootPrefix = normalizedRootDir && (withoutAlias === normalizedRootDir
        || withoutAlias.startsWith(`${normalizedRootDir}/`))
        ? `${normalizedRootDir}/`
        : '';

    return `${aliasPrefix}${rootPrefix}`;
}

function getSourceLiteral(sourceCode, node, value) {
    const quote = sourceCode.getText(node.source).startsWith('"') ? '"' : '\'';

    return `${quote}${value}${quote}`;
}

function getRootSegments(rootDir) {
    if (typeof rootDir !== 'string') {
        return null;
    }

    const rootSegments = getPathSegments(rootDir);

    return rootSegments?.length ? rootSegments : null;
}

function hasSegmentSequence(segments, sequence, startIndex) {
    return sequence.every((segment, offset) => segments[startIndex + offset] === segment);
}

function stripAlias(value, alias = '') {
    const normalizedValue = normalizeSeparators(value);

    if (normalizedValue === null || !alias) {
        return normalizedValue;
    }

    const normalizedAlias = normalizeSeparators(alias)?.replace(/\/+$/, '');

    if (!normalizedAlias) {
        return normalizedValue;
    }

    return normalizedValue.startsWith(`${normalizedAlias}/`)
        ? normalizedValue.slice(normalizedAlias.length + 1)
        : normalizedValue;
}

function extractPathFromRoot(value, rootDir = 'src') {
    const segments = getPathSegments(value);
    const rootSegments = getRootSegments(rootDir);

    if (!segments || !rootSegments) {
        return null;
    }

    const lastRootIndex = segments.length - rootSegments.length;

    for (let index = 0; index <= lastRootIndex; index += 1) {
        if (hasSegmentSequence(segments, rootSegments, index)) {
            const projectSegments = segments.slice(index + rootSegments.length);

            return projectSegments.length ? projectSegments.join('/') : null;
        }
    }

    return null;
}

function stripRootDir(value, rootDir = 'src') {
    const segments = getPathSegments(value);
    const rootSegments = getRootSegments(rootDir);

    if (!segments || !rootSegments || !hasSegmentSequence(segments, rootSegments, 0)) {
        return null;
    }

    const projectSegments = segments.slice(rootSegments.length);

    return projectSegments.length ? projectSegments.join('/') : null;
}

function parseFsdPath(value, { alias = '', rootDir = 'src', requireRoot = false } = {}) {
    const importPath = stripAlias(value, alias);

    if (!importPath || isPathRelative(importPath)) {
        return null;
    }

    let fsdPath = extractPathFromRoot(importPath, rootDir);

    if (!fsdPath) {
        if (requireRoot || importPath.startsWith('/') || /^[a-z]:\//i.test(importPath)) {
            return null;
        }

        fsdPath = importPath;
    }

    const segments = getPathSegments(fsdPath);

    if (!segments || segments.length < 2) {
        return null;
    }

    return {
        layer: segments[0],
        slice: segments[1],
        segments,
        path: segments.join('/'),
    };
}

function resolveRelativeTarget(filename, importPath, rootDir = 'src') {
    if (!isPathRelative(importPath) || typeof filename !== 'string') {
        return null;
    }

    const normalizedFilename = normalizeSeparators(filename);
    const pathApi = filename.includes('\\') || /^[a-z]:\//i.test(normalizedFilename)
        ? path.win32
        : path.posix;
    const targetPath = pathApi.resolve(pathApi.dirname(filename), importPath);

    return extractPathFromRoot(targetPath, rootDir);
}

function getFilename(context) {
    return context.filename || context.getFilename?.();
}

module.exports = {
    extractPathFromRoot,
    getFilename,
    getImportPrefix,
    getPathSegments,
    getSourceLiteral,
    isPathRelative,
    normalizeSeparators,
    parseFsdPath,
    resolveRelativeTarget,
    stripAlias,
    stripRootDir,
};
