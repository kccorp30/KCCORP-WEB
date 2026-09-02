import type { CustomerInput, VesselInput, ServiceRequestInput, ConversionResult } from '@/lib/shared/schemas';

// =========================================================
// MARINE CLOUD INTEGRATION CONTRACTS
// =========================================================
// These are TYPE-LEVEL CONTRACTS ONLY. No implementation here talks
// to real Marine Cloud operational tables — that violates the
// explicit rule in the brief ("the public website frontend [must
// not] write directly into Marine Cloud operational tables").
//
// When Marine Cloud is ready to connect, `client.ts` in this folder
// implements `MarineCloudIntegration` for real, using Marine Cloud's
// own service-layer API (not raw table writes from this codebase).
// Until then, every method is disabled — see client.ts.
// =========================================================

export interface MarineCloudIntegration {
  /** Finds a customer by phone/email, or creates one. Never merges silently — see brief section 15. */
  findOrCreateCustomer(input: CustomerInput, idempotencyKey: string): Promise<{ customerId: string; wasCreated: boolean }>;

  /** Finds a vessel by HIN (if provided) + owner, or creates one. */
  findOrCreateVessel(
    input: VesselInput,
    customerId: string,
    idempotencyKey: string,
  ): Promise<{ vesselId: string; wasCreated: boolean }>;

  /** Creates the initial service request record (pre-work-order triage stage). */
  createServiceRequest(
    input: ServiceRequestInput,
    customerId: string,
    vesselId: string,
    idempotencyKey: string,
  ): Promise<{ serviceRequestId: string }>;

  /** Promotes a service request to a full work order, optionally assigned to an organization. */
  createWorkOrder(
    serviceRequestId: string,
    organizationId: string,
    idempotencyKey: string,
  ): Promise<{ workOrderId: string }>;

  /** Links previously-uploaded lead media to the resulting vessel/work order without losing original metadata. */
  attachMedia(leadId: string, workOrderId: string): Promise<{ attachedCount: number }>;

  /** Full conversion flow: lead → customer → vessel → service request. Idempotent via idempotencyKey. */
  convertLead(leadId: string, idempotencyKey: string): Promise<ConversionResult>;

  /** Checks the current conversion_status/integration_status for a lead without re-triggering conversion. */
  checkConversionStatus(leadId: string): Promise<{ status: string; lastSyncAt: string | null }>;

  /** Re-attempts a previously failed conversion using the SAME idempotency key — never a new one. */
  retryConversion(leadId: string): Promise<ConversionResult>;

  /** Pulls status updates from Marine Cloud back into the lead record (e.g. work order completed). */
  syncUpdates(leadId: string): Promise<{ updated: boolean }>;
}

export class MarineCloudNotReadyError extends Error {
  constructor(method: string) {
    super(
      `Marine Cloud integration is not yet active. "${method}" is a prepared contract, not a working ` +
        `implementation. Enable via MARINE_CLOUD_INTEGRATION_ENABLED once Marine Cloud's service layer exists.`,
    );
    this.name = 'MarineCloudNotReadyError';
  }
}
