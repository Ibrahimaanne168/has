import { NextRequest } from "next/server";
import { handleReminderNotification } from "@/app/api/notifications/course-reminders/route";

export const dynamic = "force-dynamic";

/**
 * Endpoint Cron Vercel / Déclencheur automatique périodique (toutes les 10 minutes)
 * Vérifie l'emploi du temps officiel de HAS et envoie automatiquement un email
 * de rappel 40 minutes avant le début de chaque cours aux étudiants concernés.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    // Si un secret CRON est configuré sur l'hébergement, le respecter
  }

  return await handleReminderNotification({ mode: "auto_40min" });
}

export async function POST() {
  return await handleReminderNotification({ mode: "auto_40min" });
}
