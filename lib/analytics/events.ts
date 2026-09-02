// Canonical event names. UI components call `track(EVENT_NAME, payload)`
// — never `fbq()`/`gtag()` directly. See track.ts for the dispatcher.
export const ANALYTICS_EVENTS = {
  REQUEST_SERVICE_STARTED: 'request_service_started',
  REQUEST_SERVICE_STEP_COMPLETED: 'request_service_step_completed',
  REQUEST_SERVICE_COMPLETED: 'request_service_completed',
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  PHONE_CLICKED: 'phone_clicked',
  EMAIL_CLICKED: 'email_clicked',
  PROJECT_VIEWED: 'project_viewed',
  SERVICE_VIEWED: 'service_viewed',
  INSIGHT_VIEWED: 'insight_viewed',
  TECHNOLOGY_VIEWED: 'technology_viewed',
  MARINE_CLOUD_VIEWED: 'marine_cloud_viewed',
  CLIENT_LOGIN_CLICKED: 'client_login_clicked',
  CAMPAIGN_LANDING_VIEWED: 'campaign_landing_viewed',
  VIDEO_STARTED: 'video_started',
  VIDEO_COMPLETED: 'video_completed',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
