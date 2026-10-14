import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Route handler pour /documents/... garantissant l'accès immédiat au document PDF
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const params = await context.params;
    const slugParts = params.slug || [];
    const fileName = slugParts.join("/") || "cours.pdf";

    const localPath = path.join(process.cwd(), "public", "documents", fileName);
    try {
      const buffer = await fs.readFile(localPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${path.basename(fileName)}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fallback sur le document officiel par défaut
      const fallbackPath = path.join(process.cwd(), "public", "documents", "cours.pdf");
      const buffer = await fs.readFile(fallbackPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="cours.pdf"`,
        },
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur récupération document";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
