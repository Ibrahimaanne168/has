/**
 * Utilitaire de téléchargement de documents (PDF, images)
 * Assure que le fichier téléchargé porte son nom officiel et non "téléchargement.pdf".
 */

export function sanitizeFileName(name: string, fallback = "document.pdf"): string {
  if (!name || !name.trim()) return fallback;
  let clean = name.trim().replace(/[/\\?%*:|"<>]/g, "_");
  if (!clean.includes(".")) {
    clean += ".pdf";
  }
  return clean;
}

export function triggerDownload(url: string, fileName: string) {
  if (typeof window === "undefined" || !url) return;
  const safeName = sanitizeFileName(fileName);
  const a = document.createElement("a");
  a.href = url;
  a.download = safeName;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
