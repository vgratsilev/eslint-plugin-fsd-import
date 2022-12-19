function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../');
}

function normalizePath(from, path) {
    const fromNormalizedPath = path.toNamespacedPath(from);
    const isWindowsOS = fromNormalizedPath.includes('\\');
    const fromPath = fromNormalizedPath.split('src')[1];
    const fromArray = fromPath.split(isWindowsOS ? '\\' : '/'); // [ '', 'entities', 'Article' ]
    const fromLayer = fromArray[1]; // entities
    const fromSlice = fromArray[2]; // Article

    return { fromLayer, fromSlice };
}

module.exports = {
    isPathRelative,
    normalizePath,
};
