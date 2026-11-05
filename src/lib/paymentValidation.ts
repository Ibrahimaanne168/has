// ==============================================================================
// GESTION DU CYCLE MENSUEL ET VALIDATION DES PAIEMENTS — HAS
// ==============================================================================

/**
 * Date butoir officielle du premier cycle de cours de l'Académie HAS : 12 novembre 2026.
 * Demandée par l'administration pour que tous les étudiants inscrits lors de la session
 * initiale voient la limite fixée au 12 novembre (au lieu du 7 novembre).
 */
export const OFFICIAL_FIRST_CYCLE_EXPIRATION_ISO = "2026-11-12T23:59:59.000Z";

/**
 * Ajoute exactement 1 mois à une date en gérant proprement les débordements de fin de mois.
 * Exemples :
 * - 10 octobre -> 10 novembre
 * - 31 janvier -> 28 ou 29 février
 * - 31 mars -> 30 avril
 */
export function addOneMonth(dateInput: Date | string | number): Date {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + 1);
    return fallback;
  }

  const originalDay = d.getDate();
  d.setDate(1); // Évite le saut de 2 mois si le mois suivant a moins de jours
  d.setMonth(d.getMonth() + 1);

  // Nombre de jours dans le nouveau mois cible
  const maxDaysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, maxDaysInTargetMonth));

  return d;
}

/**
 * Formate une date en français long (ex: "12 novembre 2026").
 */
export function formatPaymentDateFull(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "Date inconnue";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Date invalide";

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Dakar",
  });
}

/**
 * Formate une date en format court JJ/MM/AAAA (ex: "12/11/2026").
 */
export function formatPaymentDateShort(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "--/--/----";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "--/--/----";

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Africa/Dakar",
  });
}

/**
 * Calcule la nouvelle date d'expiration (+1 mois).
 * Si l'étudiant paie en avance avant son expiration, le mois s'ajoute à son échéance future.
 * S'il a déjà expiré, le mois court à partir de la date de validation actuelle.
 */
export function calculateNextRenewalExpiration(
  currentExpiration?: string | Date | null,
  referenceDate: Date = new Date()
): string {
  const minFirstCycle = new Date(OFFICIAL_FIRST_CYCLE_EXPIRATION_ISO);
  if (currentExpiration) {
    const exp = new Date(currentExpiration);
    if (!isNaN(exp.getTime()) && exp.getTime() > referenceDate.getTime()) {
      const baseDate = exp.getTime() < minFirstCycle.getTime() ? minFirstCycle : exp;
      return addOneMonth(baseDate).toISOString();
    }
  }
  const base = referenceDate.getTime() < minFirstCycle.getTime() ? minFirstCycle : referenceDate;
  return addOneMonth(base).toISOString();
}

export interface StudentPaymentStatus {
  isValid: boolean;                // Paiement à jour ET compte validé
  isExpired: boolean;              // 1 mois écoulé sans validation de l'admin
  isPendingAdmin: boolean;         // Dossier en attente de validation initiale ou renouvellement
  isReminderActive: boolean;       // Dans la période de rappel (7 jours avant blocage)
  validationDate: Date | null;     // Date de début / dernière validation
  expirationDate: Date;            // Date butoir de paiement (blocage si dépassée)
  daysRemaining: number;           // Jours restants avant l'échéance (négatif si expiré)
  formattedExpirationDate: string; // Ex: "10 novembre 2026"
  shortExpirationDate: string;     // Ex: "10/11/2026"
  reminderMessage: string;         // Ex: "Paiement à renouveler avant le 10 novembre 2026"
}

/**
 * Analyse l'état complet du paiement d'un étudiant.
 */
export function getStudentPaymentStatus(
  studentData: {
    created_at?: string | null;
    updated_at?: string | null;
    date_validation_paiement?: string | null;
    date_expiration_paiement?: string | null;
    statut_inscription?: string | null;
    is_active?: boolean | null;
    role?: string | null;
    [key: string]: any;
  } | null | undefined,
  referenceDate: Date = new Date()
): StudentPaymentStatus {
  const now = referenceDate;

  if (!studentData) {
    const defaultExp = addOneMonth(now);
    return {
      isValid: false,
      isExpired: true,
      isPendingAdmin: true,
      isReminderActive: false,
      validationDate: null,
      expirationDate: defaultExp,
      daysRemaining: 0,
      formattedExpirationDate: formatPaymentDateFull(defaultExp),
      shortExpirationDate: formatPaymentDateShort(defaultExp),
      reminderMessage: `Paiement à renouveler avant le ${formatPaymentDateFull(defaultExp)}`,
    };
  }

  // 1. Détermination de la date de validation
  let valDate: Date | null = null;
  if (studentData.date_validation_paiement) {
    const parsed = new Date(studentData.date_validation_paiement);
    if (!isNaN(parsed.getTime())) valDate = parsed;
  } else if (studentData.created_at) {
    const parsed = new Date(studentData.created_at);
    if (!isNaN(parsed.getTime())) valDate = parsed;
  }

  // 2. Détermination de la date d'expiration
  let expDate: Date;
  if (studentData.date_expiration_paiement) {
    const parsed = new Date(studentData.date_expiration_paiement);
    if (!isNaN(parsed.getTime())) {
      expDate = parsed;
    } else {
      expDate = valDate ? addOneMonth(valDate) : addOneMonth(now);
    }
  } else if (valDate) {
    expDate = addOneMonth(valDate);
  } else {
    expDate = addOneMonth(now);
  }

  // Harmonisation de la limite officielle demandée par l'administration : 12 novembre 2026.
  // Permet à tous les étudiants de la première cohorte d'octobre d'avoir leur échéance au 12 novembre (au lieu du 7 nov).
  const minOfficialLimit = new Date(OFFICIAL_FIRST_CYCLE_EXPIRATION_ISO);
  if (expDate.getTime() < minOfficialLimit.getTime()) {
    expDate = minOfficialLimit;
  }

  // 3. Calcul des jours calendaires restants (comparaison basée sur les jours calendaires exacts)
  const utcTarget = Date.UTC(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysRemaining = Math.max(0, Math.round((utcTarget - utcNow) / (1000 * 60 * 60 * 24)));

  // 4. Calcul de l'expiration stricte (1 mois révolu)
  const isExpired = now.getTime() >= expDate.getTime();

  // 5. Statut d'inscription et d'activité
  const isActive = studentData.is_active === true;
  const isStatusValide = studentData.statut_inscription === "valide";

  // L'accès est valide si l'administrateur a validé ET que le mois n'a pas expiré
  const isValid = isActive && isStatusValide && !isExpired;

  // En attente : soit inscription initiale pas encore validée, soit paiement expiré en attente de révalidation par l'admin
  const isPendingAdmin = !isStatusValide || !isActive || isExpired;

  // Période de rappel : active avant la date de blocage (7 jours avant jusqu'à l'échéance)
  const isReminderActive = !isExpired && daysRemaining <= 7 && daysRemaining >= 0;

  const formattedExpirationDate = formatPaymentDateFull(expDate);
  const shortExpirationDate = formatPaymentDateShort(expDate);

  // Message simple demandé explicitement par l'utilisateur :
  // "Paiement à renouveler avant le ....."
  const reminderMessage = `Paiement à renouveler avant le ${formattedExpirationDate}`;

  return {
    isValid,
    isExpired,
    isPendingAdmin,
    isReminderActive,
    validationDate: valDate,
    expirationDate: expDate,
    daysRemaining,
    formattedExpirationDate,
    shortExpirationDate,
    reminderMessage,
  };
}

