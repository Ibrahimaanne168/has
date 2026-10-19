export interface DriveFolderInfo {
  niveau: "L1" | "L2";
  label: string;
  badge: string;
  url: string;
  description: string;
  profActionText: string;
  studentActionText: string;
}

export const DRIVE_RECORDINGS: Record<"L1" | "L2", DriveFolderInfo> = {
  L1: {
    niveau: "L1",
    label: "Licence 1 (L1)",
    badge: "Promotion L1",
    url: "https://drive.google.com/drive/folders/1wianazBwZRWvLdO9FF3CygPVXs-Cg09e?usp=drive_link",
    description: "Dossier officiel des enregistrements vidéo et replays des cours en ligne de Licence 1.",
    profActionText: "Déposer un cours enregistré (L1)",
    studentActionText: "Visionner les cours de L1",
  },
  L2: {
    niveau: "L2",
    label: "Licence 2 (L2)",
    badge: "Promotion L2",
    url: "https://drive.google.com/drive/folders/1qKr7ge-C627zoECVxYYOwL-Kuf6309kX?usp=drive_link",
    description: "Dossier officiel des enregistrements vidéo et replays des cours en ligne de Licence 2.",
    profActionText: "Déposer un cours enregistré (L2)",
    studentActionText: "Visionner les cours de L2",
  },
};

export function getDriveLinkForNiveau(niveau?: string | null): DriveFolderInfo {
  if (!niveau) return DRIVE_RECORDINGS.L1;
  const normalized = niveau.toUpperCase();
  if (normalized.includes("2") || normalized.startsWith("L2")) {
    return DRIVE_RECORDINGS.L2;
  }
  return DRIVE_RECORDINGS.L1;
}
