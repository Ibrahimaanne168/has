// ==============================================================================
// ADAPTATEUR DE COMPATIBILITÉ — REDIRECTION VERS RESEND
// ==============================================================================

export {
  sendTransactionalEmail,
  send2FACodeEmail,
  sendPasswordResetEmail,
} from "./resend";
