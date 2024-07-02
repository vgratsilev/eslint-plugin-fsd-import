function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../');
}

// function isWindowsPath(path) {
//     return path.includes('\\');
// }

function normalizePath(from, path) {
    const fromNormalizedPath = path.toNamespacedPath(from).replace(/\\/g, '/');
    return fromNormalizedPath.split('src')[1]; // /entities/Article/ui/ArticlePage/ArticlePage.tsx
}

function getCurrentFileLayer(currentFilePath) {
    const normalizedPath = currentFilePath.replace(/\\/g, '/');
    const projectPath = normalizedPath?.split('src')[1];
    const segments = projectPath?.split('/');
    return segments?.[1];
}

module.exports = {
    isPathRelative,
    normalizePath,
    getCurrentFileLayer,
};
