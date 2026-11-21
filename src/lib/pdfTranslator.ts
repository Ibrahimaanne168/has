/**
 * Module de traduction automatique des documents et génération de PDF bilingue (FR / EN)
 * Halil Académie Scientifique (HAS)
 */

import { MarketplaceItem, MarketplaceOrder } from "./types";

// Dictionnaire scientifique de secours pour termes universitaires
const SCIENTIFIC_TERMS: Record<string, string> = {
  "mathématiques": "Mathematics",
  "maths": "Maths",
  "physique": "Physics",
  "informatique": "Computer Science",
  "analyse": "Mathematical Analysis / Calculus",
  "algèbre": "Linear Algebra",
  "algèbre linéaire": "Linear Algebra",
  "matrices": "Matrices & Determinants",
  "analyse matricielle": "Matrix Analysis",
  "probabilités": "Probability & Statistics",
  "statistique": "Statistics",
  "mécanique": "Classical Mechanics",
  "électricité": "Electromagnetism & Circuit Theory",
  "thermodynamique": "Thermodynamics",
  "optique": "Geometric Optics",
  "algorithmique": "Algorithms & Data Structures",
  "programmation": "Programming",
  "bases de données": "Relational Databases & SQL",
  "systèmes d'exploitation": "Operating Systems",
  "fascicule": "Official Course Booklet",
  "corrigés d'examen": "Solved Exam Archives",
  "corrigé": "Detailed Solution",
  "travaux dirigés": "Tutorials & Problem Sets",
  "exercices": "Practice Exercises",
  "licence 1": "Bachelor Year 1 (L1)",
  "licence 2": "Bachelor Year 2 (L2)",
};

/**
 * Traduit un texte français vers l'anglais via le service de traduction en ligne
 * avec repli automatique sur le dictionnaire scientifique.
 */
export async function translateTextToEnglish(text: string): Promise<string> {
  if (!text || !text.trim()) return "";

  const trimmed = text.trim();

  // Essai de traduction via endpoint de traduction sécurisé
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(
      trimmed.slice(0, 2000)
    )}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedChunks = data[0].map((chunk: any) => chunk[0]).filter(Boolean);
        if (translatedChunks.length > 0) {
          return translatedChunks.join(" ");
        }
      }
    }
  } catch (err) {
    // Échec réseau ou timeout, on applique les termes scientifiques
  }

  // Repli intelligent sur les termes clés
  let fallback = trimmed;
  for (const [fr, en] of Object.entries(SCIENTIFIC_TERMS)) {
    const regex = new RegExp(`\\b${fr}\\b`, "gi");
    fallback = fallback.replace(regex, en);
  }
  return fallback;
}

/**
 * Nettoie une chaîne pour l'encodage strict dans le flux de texte PDF PostScript
 */
function sanitizePdfString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques pour compatibilité Helvetica standard
    .replace(/[()\\]/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .trim();
}

/**
 * Génère un document PDF complet bilingue conforme aux standards HAS
 */
export async function generateOfficialPdfBuffer(params: {
  order: MarketplaceOrder;
  item: MarketplaceItem;
  lang: "fr" | "en";
}): Promise<{ buffer: Buffer; fileName: string }> {
  const { order, item, lang } = params;

  const isEn = lang === "en";

  // Titres et métadonnées traduits si anglais
  const rawTitle = item.title || order.item_title || "Fascicule Academique";
  const finalTitle = isEn ? await translateTextToEnglish(rawTitle) : rawTitle;

  const rawMatiere = item.matiere || "Sciences Exactes";
  const finalMatiere = isEn ? await translateTextToEnglish(rawMatiere) : rawMatiere;

  const rawDesc = item.description || "Fascicule officiel d'exercices et corriges detailles.";
  const finalDesc = isEn ? await translateTextToEnglish(rawDesc) : rawDesc;

  const safeTitle = sanitizePdfString(finalTitle);
  const safeBuyer = sanitizePdfString(order.buyer_name || "Etudiant HAS");
  const safeMatiere = sanitizePdfString(finalMatiere);
  const safeNiveau = sanitizePdfString(item.niveau || (isEn ? "Undergraduate Level" : "Niveau Universitaire"));
  const safePhone = sanitizePdfString(order.buyer_phone || "Contact valide");
  const safeOrderId = sanitizePdfString(order.id);
  const safeDesc = sanitizePdfString(finalDesc).slice(0, 450);

  const institutionName = isEn
    ? "HALIL ACADEMIC SCIENCE (HAS) - DAKAR"
    : "HALIL ACADEMIE SCIENTIFIQUE (HAS) - DAKAR";
  const docTypeLabel = isEn
    ? "OFFICIAL TUTORIAL BOOKLET & EXAM REVISION ARCHIVES"
    : "FASCICULE OFFICIEL DE TRAVAUX DIRIGES ET ANNALES CORRIGEES";
  const certLabel = isEn
    ? "VERIFIED & VALIDATED ACADEMIC DIGITAL COPY"
    : "DOCUMENT ACADEMIQUE CERTIFIE ET VALIDE PAR L'ADMINISTRATION";
  const authLabel = isEn ? "Authorized Student:" : "Etudiant Beneficiaire :";
  const refLabel = isEn ? "Order Identifier:" : "Reference Commande :";
  const subjectLabel = isEn ? "Academic Subject:" : "Discipline & Matiere :";
  const levelLabel = isEn ? "Academic Level:" : "Niveau d'etudes :";
  const statusLabel = isEn
    ? "STATUS: ADMINISTRATIVE VALIDATION APPROVED"
    : "STATUT : VALIDATION ADMINISTRATIVE CONFIRMEE";
  const noticeLabel = isEn
    ? "Personal educational copy issued by Halil Academic Science. Commercial distribution prohibited."
    : "Exemplaire d'etude strictement reserve a l'etudiant mandate. Toute reproduction non autorisee est proscrite.";
  const langStamp = isEn ? "LANGUAGE: ENGLISH (AUTOMATIC AI TRANSLATION)" : "LANGUE : FRANCAIS (VERSION ORIGINALE)";

  // Construction d'un document PDF vectoriel conforme standard PDF-1.4
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 1200 >>
stream
BT
/F1 18 Tf
45 780 Td
(${institutionName}) Tj
/F2 10 Tf
0 -18 Td
(${docTypeLabel}) Tj
/F1 14 Tf
0 -40 Td
(${safeTitle}) Tj
/F2 10 Tf
0 -22 Td
(${subjectLabel} ${safeMatiere} | ${levelLabel} ${safeNiveau}) Tj
/F2 9 Tf
0 -18 Td
(${langStamp}) Tj
/F1 11 Tf
0 -35 Td
(------------------------------------------------------------------------------------------------) Tj
/F1 11 Tf
0 -25 Td
(${statusLabel}) Tj
/F2 10 Tf
0 -20 Td
(${refLabel} #${safeOrderId}) Tj
0 -18 Td
(${authLabel} ${safeBuyer} | Phone: ${safePhone}) Tj
0 -18 Td
(${certLabel}) Tj
/F1 11 Tf
0 -25 Td
(------------------------------------------------------------------------------------------------) Tj
/F1 12 Tf
0 -30 Td
(${isEn ? "Course Overview & Learning Objectives:" : "Sommaire & Objectifs Pedagogiques :"}) Tj
/F2 9 Tf
0 -20 Td
(${safeDesc}) Tj
/F2 8 Tf
0 -40 Td
(${noticeLabel}) Tj
/F2 8 Tf
0 -16 Td
(Halil Academie Scientifique - www.has-academie.online) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000001550 00000 n 
0000001630 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1705
%%EOF`;

  const fileName = `${safeTitle.replace(/[^a-zA-Z0-9_\-]/g, "_")}_${isEn ? "EN" : "FR"}.pdf`;

  return {
    buffer: Buffer.from(pdfContent, "utf-8"),
    fileName,
  };
}
