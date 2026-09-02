import { z } from 'zod';

// =========================================================
// SHARED DATA CONTRACTS
// =========================================================
// Single source of truth for shapes used by: the public website
// (Request Service form), the server-side lead API, and the future
// KCC Marine Cloud integration layer.
//
// PLACEMENT NOTE (see docs/monorepo-plan.md): this file lives at
// lib/shared/schemas.ts today because the website and Marine Cloud
// are still separate codebases. When they're extracted into a
// monorepo, this file moves verbatim to /packages/validation — no
// shape changes needed, only the import path.
//
// NAMING IS CANONICAL — do not introduce synonyms (e.g. `boat_make`
// vs `vessel_manufacturer`) anywhere else in either codebase.
// =========================================================

export const LocationInputSchema = z.object({
  country: z.string().min(1),
  region: z.string().optional(), // state/province — optional, not all countries use it
  city: z.string().min(1),
});
export type LocationInput = z.infer<typeof LocationInputSchema>;

export const CustomerInputSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(30),
  email: z.string().email().optional().or(z.literal('')),
  preferredContactMethod: z.enum(['phone', 'email', 'whatsapp']).default('phone'),
});
export type CustomerInput = z.infer<typeof CustomerInputSchema>;

export const VesselInputSchema = z.object({
  make: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  name: z.string().max(80).optional(), // vessel's own name, e.g. "Sea Ray 340"
  hin: z.string().max(40).optional(), // Hull Identification Number — optional
});
export type VesselInput = z.infer<typeof VesselInputSchema>;

export const MediaAttachmentSchema = z.object({
  storagePath: z.string().min(1), // path within the private Supabase bucket
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  kind: z.enum(['image', 'video']),
});
export type MediaAttachment = z.infer<typeof MediaAttachmentSchema>;

export const AttributionSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
  landingPage: z.string().optional(),
  // First-touch (Sprint 6, item 2) — captured once via cookie, never
  // overwritten by later navigation. Kept separate from the
  // submission-time fields above.
  firstUtmSource: z.string().optional(),
  firstUtmMedium: z.string().optional(),
  firstUtmCampaign: z.string().optional(),
  firstUtmContent: z.string().optional(),
  firstReferrer: z.string().optional(),
  firstLandingPage: z.string().optional(),
  firstTouchAt: z.string().optional(),
});
export type Attribution = z.infer<typeof AttributionSchema>;

// The full Request Service submission — what the client sends to
// POST /api/leads. Server re-validates this; never trust the client.
export const ServiceRequestInputSchema = z.object({
  location: LocationInputSchema,
  serviceType: z.string().min(1),
  vessel: VesselInputSchema,
  description: z.string().min(10).max(2000),
  media: z.array(MediaAttachmentSchema).max(10).default([]),
  customer: CustomerInputSchema,
  attribution: AttributionSchema.optional(),
  // Honeypot — must be empty. A filled value means a bot filled every
  // field, including the one real users never see. See section 9.
  website: z.string().max(0).optional(),
});
export type ServiceRequestInput = z.infer<typeof ServiceRequestInputSchema>;

// The persisted Lead — mirrors the `leads` table shape (see
// migrations/007_leads_extension.sql). Used by the integration
// layer, never exposed to the public frontend as-is (no public
// read endpoint returns this).
export const LeadSchema = z.object({
  id: z.string().uuid(),
  referenceCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(['new', 'contacted', 'qualified', 'estimate', 'booked', 'lost', 'converted']),
  country: z.string().nullable(),
  region: z.string().nullable(),
  city: z.string().nullable(),
  serviceType: z.string().nullable(),
  vesselMake: z.string().nullable(),
  vesselModel: z.string().nullable(),
  vesselYear: z.number().nullable(),
  vesselName: z.string().nullable(),
  hin: z.string().nullable(),
  description: z.string().nullable(),
  customerName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  preferredContactMethod: z.string().nullable(),
  source: z.string().nullable(),
  medium: z.string().nullable(),
  campaign: z.string().nullable(),
  utmSource: z.string().nullable(),
  utmMedium: z.string().nullable(),
  utmCampaign: z.string().nullable(),
  utmContent: z.string().nullable(),
  referrer: z.string().nullable(),
  landingPage: z.string().nullable(),
  internalNotes: z.string().nullable(),
  mediaCount: z.number(),
  // Integration fields — nullable/unused until Marine Cloud is connected
  marineCloudCustomerId: z.string().uuid().nullable(),
  marineCloudVesselId: z.string().uuid().nullable(),
  marineCloudWorkOrderId: z.string().uuid().nullable(),
  conversionStatus: z.enum(['not_converted', 'pending', 'converted', 'failed']).nullable(),
  convertedAt: z.string().nullable(),
  convertedBy: z.string().uuid().nullable(),
  integrationStatus: z.enum(['pending', 'synced', 'error']).nullable(),
  integrationError: z.string().nullable(),
  lastSyncAt: z.string().nullable(),
});
export type Lead = z.infer<typeof LeadSchema>;

// Result contract for the future conversion action — what
// /api/integrations/marine-cloud/leads/[id]/convert will return
// once implemented.
export const ConversionResultSchema = z.object({
  success: z.boolean(),
  leadId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  vesselId: z.string().uuid().optional(),
  workOrderId: z.string().uuid().optional(),
  error: z.string().optional(),
  idempotencyKey: z.string(),
});
export type ConversionResult = z.infer<typeof ConversionResultSchema>;
