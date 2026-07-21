export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AUTH_TOKEN_KEY = 'token';

export const INSTITUTION_TYPES = [
  'University',
  'College',
  'School',
  'Training Institute',
  'EdTech',
];

export const LEAD_STATUSES = [
  'New Lead',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Negotiation',
  'Closed',
  'Closed (Lost)',
];

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Conference',
  'Cold Outreach',
  'LinkedIn',
  'Other',
];
