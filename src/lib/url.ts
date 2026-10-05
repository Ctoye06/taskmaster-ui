/**
 * Prefix an app-absolute path with the site's configured `base` so links work
 * both at the domain root during local dev and under a sub-path such as
 * `/taskmaster-ui/` on GitHub Pages. Pass root-relative paths (e.g. `/tasks`).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
