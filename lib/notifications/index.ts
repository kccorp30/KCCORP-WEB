import 'server-only';

// Provider-independent notification layer (brief section 13).
// Every call site imports `notify`, never a specific provider SDK
// directly — swapping email/WhatsApp providers later means changing
// only the implementation below, not every call site.

export interface NotificationPayload {
  type: 'lead_customer_confirmation' | 'lead_internal_alert' | 'lead_whatsapp_notify' | 'marine_cloud_sync';
  leadId: string;
  referenceCode: string;
  to?: string; // email or phone, depending on type
  data?: Record<string, unknown>;
}

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }>;
}

// Default implementation: logs only. Replace with a real provider
// (Resend, Postmark, WhatsApp Business API, etc.) when one is chosen —
// this is intentionally NOT wired to a live provider yet, per the
// brief's instruction not to couple to one unnecessarily.
class ConsoleNotificationProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    console.log('[notifications] (stub — no provider configured)', payload.type, payload.referenceCode);
    return { success: true };
  }
}

let activeProvider: NotificationProvider = new ConsoleNotificationProvider();

export function setNotificationProvider(provider: NotificationProvider) {
  activeProvider = provider;
}

export async function notify(payload: NotificationPayload) {
  return activeProvider.send(payload);
}
