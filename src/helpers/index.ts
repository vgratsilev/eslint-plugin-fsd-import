import { PlatformPath } from "path";

export function isPathRelative(path: string) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

export function normalizePath(from: string, path: PlatformPath) {
  const fromNormalizedPath = path.toNamespacedPath(from).replace(/\\/g, "/");
  return fromNormalizedPath.split("src")[1]; // /entities/Article/ui/ArticlePage/ArticlePage.tsx
}

export function getCurrentFileLayer(currentFilePath: string) {
  const normalizedPath = currentFilePath.replace(/\\/g, "/");
  const projectPath = normalizedPath?.split("src")[1];
  const segments = projectPath?.split("/");
  return segments?.[1];
}
