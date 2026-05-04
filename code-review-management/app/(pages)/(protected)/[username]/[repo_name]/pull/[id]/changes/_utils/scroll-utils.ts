// If we click on a thread header, close its file-diff, and re-click on the
// same thread header, the hash will not change and no scroll will be
// triggered. Thus, manually dispatch a hash change event.
// Docs: https://stackoverflow.com/a/15212106
export function handleAnchorClick(anchorHref: string) {
  if (window.location.hash === anchorHref) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}
