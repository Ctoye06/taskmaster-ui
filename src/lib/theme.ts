/**
 * Theme plumbing shared by the client-side scripts (the navbar toggle and the
 * command-palette easter egg). Keeping the list of valid themes and the
 * apply/persist logic in one module means every entry point agrees on what a
 * "theme" is and recolours the UI the same way.
 *
 * Each theme is just a value for the `data-theme` attribute on <html>; the
 * actual palettes live in `src/styles/global.css`, where every Tailwind
 * `var(--color-*)` utility re-points to the active theme's tokens.
 */

export type ThemeName = "dark" | "light" | "amber" | "cyan" | "magenta";

/** Every selectable theme. `dark` (green phosphor) is the default. */
export const THEMES: ThemeName[] = [
  "dark",
  "light",
  "amber",
  "cyan",
  "magenta",
];

/** localStorage key the pre-paint script in Layout.astro also reads. */
export const THEME_STORAGE_KEY = "eayl-theme";

/** Browser-chrome colour per theme, matching each palette's `--color-term-bg`. */
export const THEME_META_COLOR: Record<ThemeName, string> = {
  dark: "#080b10",
  light: "#f4f6f3",
  amber: "#0d0a06",
  cyan: "#060c12",
  magenta: "#0c0712",
};

/** Event fired on `window` whenever the theme changes, so other widgets sync. */
export const THEME_CHANGE_EVENT = "eayl:themechange";

export function isTheme(value: unknown): value is ThemeName {
  return typeof value === "string" && (THEMES as string[]).includes(value);
}

/** The theme currently applied to <html>, falling back to `dark`. */
export function getActiveTheme(): ThemeName {
  const attr = document.documentElement.getAttribute("data-theme");
  return isTheme(attr) ? attr : "dark";
}

/**
 * Apply a theme everywhere: flip the attribute, persist the choice, update the
 * browser-chrome colour, and announce the change so the navbar (and anything
 * else listening) can reflect it. Safe to call from any client script.
 */
export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — theme still applies for this session */
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_META_COLOR[theme]);

  window.dispatchEvent(
    new CustomEvent<{ theme: ThemeName }>(THEME_CHANGE_EVENT, {
      detail: { theme },
    }),
  );
}
