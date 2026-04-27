export function formatClassUrlCode(value) {
    const clean = String(value ?? "")
        .replace(/\s+/g, "")
        .replaceAll("-", "")
        .toUpperCase();

    const match = clean.match(/^([A-Z]+)(\d+[A-Z]*)$/);

    if (!match) return clean;

    return `${match[1]}-${match[2]}`;
}

export function normalizeClassCode(value) {
    return String(value ?? "")
        .replace(/\s+/g, "")
        .replaceAll("-", "")
        .toUpperCase();
}