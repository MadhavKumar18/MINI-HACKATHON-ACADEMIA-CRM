export const DEMO_USER = {
  id: 'demo-user-001',
  name: 'Demo Sales Manager',
  email: 'demo@academiacrm.com',
};

export const MOCK_LEADS = [
  {
    _id: 'lead-001',
    institution_name: 'Delhi Technical University',
    location: 'New Delhi, India',
    contact_person: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@dtu.ac.in',
    phone: '+91 98765 43210',
    institution_type: 'University',
    student_strength: 8500,
    program_interest: 'Engineering ERP & LMS',
    lead_source: 'Conference',
    lead_status: 'Proposal Sent',
    created_at: '2026-06-10T10:00:00',
    updated_at: '2026-06-20T10:00:00',
  },
  {
    _id: 'lead-002',
    institution_name: "St. Xavier's College Mumbai",
    location: 'Mumbai, India',
    contact_person: 'Prof. Anita Desai',
    email: 'anita.desai@xaviers.edu',
    phone: '+91 98200 12345',
    institution_type: 'College',
    student_strength: 4200,
    program_interest: 'Admissions CRM',
    lead_source: 'Referral',
    lead_status: 'Meeting Scheduled',
    created_at: '2026-06-13T10:00:00',
    updated_at: '2026-06-21T10:00:00',
  },
  {
    _id: 'lead-003',
    institution_name: 'Bangalore International School',
    location: 'Bangalore, India',
    contact_person: 'Mr. Suresh Menon',
    email: 'suresh@bis.edu.in',
    phone: '+91 99887 76655',
    institution_type: 'School',
    student_strength: 1200,
    program_interest: 'Student Engagement Platform',
    lead_source: 'Website',
    lead_status: 'Contacted',
    created_at: '2026-06-16T10:00:00',
    updated_at: '2026-06-22T10:00:00',
  },
  {
    _id: 'lead-004',
    institution_name: 'Chennai Institute of Management',
    location: 'Chennai, India',
    contact_person: 'Dr. Priya Nair',
    email: 'priya.nair@cim.edu',
    phone: '+91 94440 55667',
    institution_type: 'Training Institute',
    student_strength: 2800,
    program_interest: 'MBA Placement CRM',
    lead_source: 'LinkedIn',
    lead_status: 'Negotiation',
    created_at: '2026-06-19T10:00:00',
    updated_at: '2026-06-23T10:00:00',
  },
  {
    _id: 'lead-005',
    institution_name: 'Pune Engineering College',
    location: 'Pune, India',
    contact_person: 'Dr. Vikram Patil',
    email: 'vikram.patil@pec.edu',
    phone: '+91 97654 32109',
    institution_type: 'College',
    student_strength: 5600,
    program_interest: 'Campus Placement Suite',
    lead_source: 'Cold Outreach',
    lead_status: 'Closed',
    created_at: '2026-06-22T10:00:00',
    updated_at: '2026-06-24T10:00:00',
  },
  {
    _id: 'lead-006',
    institution_name: 'Hyderabad EdTech Academy',
    location: 'Hyderabad, India',
    contact_person: 'Ms. Kavitha Reddy',
    email: 'kavitha@edtechacademy.in',
    phone: '+91 90123 45678',
    institution_type: 'EdTech',
    student_strength: 950,
    program_interest: 'Online Learning CRM',
    lead_source: 'Website',
    lead_status: 'New Lead',
    created_at: '2026-06-24T10:00:00',
    updated_at: '2026-06-24T10:00:00',
  },
];

export const MOCK_FOLLOWUPS = [
  {
    _id: 'followup-001',
    lead_id: 'lead-001',
    lead_name: 'Delhi Technical University',
    notes: 'Send revised proposal with pricing breakdown',
    reminder_date: '2026-06-27T14:00:00',
    is_completed: false,
    created_at: '2026-06-20T10:00:00',
  },
  {
    _id: 'followup-002',
    lead_id: 'lead-002',
    lead_name: "St. Xavier's College Mumbai",
    notes: 'Demo call — Admissions CRM walkthrough',
    reminder_date: '2026-06-26T11:00:00',
    is_completed: false,
    created_at: '2026-06-21T10:00:00',
  },
  {
    _id: 'followup-003',
    lead_id: 'lead-003',
    lead_name: 'Bangalore International School',
    notes: 'Follow up on brochure email sent last week',
    reminder_date: '2026-06-29T10:30:00',
    is_completed: false,
    created_at: '2026-06-22T10:00:00',
  },
  {
    _id: 'followup-004',
    lead_id: 'lead-004',
    lead_name: 'Chennai Institute of Management',
    notes: 'Contract negotiation — discuss annual licensing',
    reminder_date: '2026-06-28T15:00:00',
    is_completed: false,
    created_at: '2026-06-23T10:00:00',
  },
  {
    _id: 'followup-005',
    lead_id: 'lead-005',
    lead_name: 'Pune Engineering College',
    notes: 'Post-sale onboarding kickoff meeting',
    reminder_date: '2026-06-23T09:00:00',
    is_completed: true,
    created_at: '2026-06-18T10:00:00',
  },
  {
    _id: 'followup-006',
    lead_id: 'lead-001',
    lead_name: 'Delhi Technical University',
    notes: 'Initial discovery call notes review',
    reminder_date: '2026-06-20T16:00:00',
    is_completed: true,
    created_at: '2026-06-15T10:00:00',
  },
];

export const MOCK_DASHBOARD_STATS = {
  summary: {
    total_institutions: 6,
    active_leads: 5,
    meetings: 4,
    closed_deals: 1,
  },
  status_distribution: [
    { name: 'Proposal Sent', value: 1 },
    { name: 'Meeting Scheduled', value: 1 },
    { name: 'Contacted', value: 1 },
    { name: 'Negotiation', value: 1 },
    { name: 'Closed', value: 1 },
    { name: 'New Lead', value: 1 },
  ],
  type_distribution: [
    { name: 'University', value: 1 },
    { name: 'College', value: 2 },
    { name: 'School', value: 1 },
    { name: 'Training Institute', value: 1 },
    { name: 'EdTech', value: 1 },
  ],
  recent_activity: MOCK_LEADS.slice(0, 5),
  report: {
    conversion_rate: '16.7%',
    avg_deal_size: '₹4.2 Lakh',
    pipeline_value: '₹18.5 Lakh',
    top_source: 'Website',
  },
};

export const generateMockAIResponse = (taskType, leadData, prompt = '') => {
  const name = leadData?.institution_name || 'the institution';
  const contact = leadData?.contact_person || 'the contact';
  const program = leadData?.program_interest || 'our academic programs';
  const strength = leadData?.student_strength || 0;
  const status = leadData?.lead_status || 'New Lead';

  const responses = {
    lead_priority: `Lead Priority Analysis — ${name}\n${'='.repeat(40)}\nPriority Score: 82/100 (HIGH)\n\nKey Factors:\n• Student strength (${strength.toLocaleString()}) indicates strong market potential\n• Current status '${status}' suggests active pipeline\n• Program fit for ${program} is excellent\n\nRecommendation: Prioritize immediate outreach.\n${prompt ? `Note: ${prompt}` : ''}`,

    next_action: `Next Best Action — ${name}\n${'='.repeat(40)}\nCurrent Stage: ${status}\n\nRecommended Action:\n→ Schedule a product demo and share ROI case study\n\nSuggested Timeline: Within 2-3 business days`,

    email: `Subject: Partnership Opportunity — ${program} for ${name}\n\nDear ${contact},\n\nI hope this message finds you well. I am reaching out regarding ${program} that would benefit the ${strength.toLocaleString()}+ students at ${name}.\n\nWould you be available for a brief 20-minute call this week?\n\nBest regards,\nAcademia CRM Sales Team`,

    followup_suggestion: `Follow-up Strategy — ${name}\n${'='.repeat(40)}\n1. Day 3: Send case study from similar institution\n2. Day 7: LinkedIn connection to ${contact}\n3. Day 10: Phone call on ${program}\n4. Day 14: Share ROI calculator\n\nOptimal time: Tue–Thu, 10 AM – 12 PM IST`,
  };

  return responses[taskType] || `Mock AI analysis for ${name}. Query: ${prompt || 'General analysis'}`;
};
