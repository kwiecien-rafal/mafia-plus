// Shared by the build-time haystack builder (search.ts) and the client filter
// (SearchBar.astro), so both sides normalize text identically. Lowercase first,
// then map l-stroke explicitly - unlike the other Polish diacritics it has no
// NFD decomposition - and strip the combining marks the rest decompose into.
export function fold(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
