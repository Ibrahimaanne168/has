export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "cancelled";

export interface WaveCheckoutSessionRequest {
  amount: string; // e.g. "25000"
  currency: string; // "XOF"
  error_url: string;
  success_url: string;
  client_reference: string;
  restrict_pid_to_single_currency?: boolean;
}

export interface WaveCheckoutSessionResponse {
  id: string; // "cos-..."
  amount: string;
  currency: string;
  wave_launch_url: string; // "https://pay.wave.com/c/cos-..."
  checkout_status: "open" | "complete" | "cancelled" | "expired";
  client_reference: string;
  transaction_id?: string | null;
  when_created?: string;
  when_expires?: string;
  when_completed?: string | null;
}

export interface WaveWebhookEvent {
  id: string;
  type: "checkout.session.completed" | "checkout.session.failed" | string;
  data: {
    id: string;
    amount: string;
    currency: string;
    checkout_status: string;
    client_reference: string;
    transaction_id?: string | null;
    payment_status?: string;
    when_completed?: string;
  };
}

export interface OrderRecord {
  id: string;
  user_id?: string | null;
  email: string;
  full_name?: string | null;
  matricule?: string | null;
  filiere?: string | null;
  niveau?: string | null;
  description?: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: PaymentStatus;
  client_reference: string;
  wave_checkout_id?: string | null;
  wave_launch_url?: string | null;
  wave_transaction_id?: string | null;
  created_at: string;
  paid_at?: string | null;
  updated_at?: string;
}
