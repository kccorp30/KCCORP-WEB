import 'server-only';
import type { MarineCloudIntegration } from './contracts';
import { MarineCloudNotReadyError } from './contracts';

// Feature flag — OFF by default. There is no real Marine Cloud
// service layer to call yet (Marine Cloud itself is still schema-only,
// migrations 001-008). Flipping this on before that exists would mean
// implementing "fake operational behavior", which the brief explicitly
// forbids.
const INTEGRATION_ENABLED = process.env.MARINE_CLOUD_INTEGRATION_ENABLED === 'true';

class DisabledMarineCloudClient implements MarineCloudIntegration {
  async findOrCreateCustomer(): Promise<never> {
    throw new MarineCloudNotReadyError('findOrCreateCustomer');
  }
  async findOrCreateVessel(): Promise<never> {
    throw new MarineCloudNotReadyError('findOrCreateVessel');
  }
  async createServiceRequest(): Promise<never> {
    throw new MarineCloudNotReadyError('createServiceRequest');
  }
  async createWorkOrder(): Promise<never> {
    throw new MarineCloudNotReadyError('createWorkOrder');
  }
  async attachMedia(): Promise<never> {
    throw new MarineCloudNotReadyError('attachMedia');
  }
  async convertLead(): Promise<never> {
    throw new MarineCloudNotReadyError('convertLead');
  }
  async checkConversionStatus(): Promise<never> {
    throw new MarineCloudNotReadyError('checkConversionStatus');
  }
  async retryConversion(): Promise<never> {
    throw new MarineCloudNotReadyError('retryConversion');
  }
  async syncUpdates(): Promise<never> {
    throw new MarineCloudNotReadyError('syncUpdates');
  }
}

// When Marine Cloud's own service layer exists, implement a real
// class here (e.g. `LiveMarineCloudClient implements MarineCloudIntegration`)
// that calls Marine Cloud's API — never raw Supabase table writes
// from this codebase. Swap the export below once that's ready.
export function getMarineCloudClient(): MarineCloudIntegration {
  if (!INTEGRATION_ENABLED) {
    return new DisabledMarineCloudClient();
  }
  // Guard: flag is on but no real implementation exists yet. Fail
  // loudly instead of silently falling back to fake behavior.
  throw new Error(
    'MARINE_CLOUD_INTEGRATION_ENABLED=true but no live implementation exists yet. ' +
      'Do not enable this flag until a real MarineCloudIntegration implementation replaces DisabledMarineCloudClient.',
  );
}
