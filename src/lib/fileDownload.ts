/**
 * Utilitaire universel de téléchargement / ouverture de fichiers (PDF, supports, EDT)
 * Compatible iOS Safari, iPadOS, Android, macOS et Windows.
 *
 * Résout les problèmes critiques d'iOS Safari :
 * 1. Blocage des data URLs (data:application/pdf;base64,...)
 * 2. Ignorance de l'attribut `download` sur les URLs distantes (CORS)
 * 3. Ouverture fluide dans le visualiseur PDF natif d'iOS avec option d'enregistrement
 */

export function isIOSDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function dataUrlToBlob(dataUrl: string): Blob {
  try {
    const parts = dataUrl.split(",");
    const mimeMatch = parts[0]?.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
    const b64Data = parts[1] || "";
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  } catch {
    return new Blob([], { type: "application/pdf" });
  }
}

export async function downloadOrOpenDocument(
  fileUrl: string,
  fileName: string = "document.pdf",
  e?: React.MouseEvent
): Promise<void> {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!fileUrl) return;

  const isIOS = isIOSDevice();

  try {
    let blobUrl: string = fileUrl;
    let shouldRevoke = false;

    if (fileUrl.startsWith("data:")) {
      // Conversion data URL -> Blob pour contourner le blocage WebKit / iOS Safari
      const blob = dataUrlToBlob(fileUrl);
      blobUrl = URL.createObjectURL(blob);
      shouldRevoke = true;
    } else if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      // Tenter un fetch pour obtenir un blob avec le bon nom sous Android / PC
      try {
        const response = await fetch(fileUrl, { mode: "cors" });
        if (response.ok) {
          const blob = await response.blob();
          blobUrl = URL.createObjectURL(blob);
          shouldRevoke = true;
        }
      } catch {
        blobUrl = fileUrl;
      }
    }

    if (isIOS) {
      // Sur iOS / iPadOS, Safari gère parfaitement les fenêtres/onglets avec blob ou url directe
      // pour afficher le visualiseur PDF natif avec bouton de partage / enregistrement dans Fichiers
      const newTab = window.open(blobUrl, "_blank");
      if (!newTab) {
        // En cas de blocage pop-up strict, navigation directe
        window.location.href = blobUrl;
      }
      if (shouldRevoke) {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }
      return;
    }

    // Comportement standard (Android, Windows, macOS Chrome/Firefox)
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName.replace(/[/\\?%*:|"<>]/g, "_");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (shouldRevoke) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
  } catch (err) {
    console.warn("[DOWNLOAD ERROR - FALLBACK TO DIRECT LINK]", err);
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }
}
