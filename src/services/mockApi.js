import {
  DEMO_USER,
  MOCK_DASHBOARD_STATS,
  MOCK_FOLLOWUPS,
  MOCK_LEADS,
  generateMockAIResponse,
} from '../data/mockData';

let leadsStore = [...MOCK_LEADS];
let followupsStore = [...MOCK_FOLLOWUPS];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (data) => JSON.parse(JSON.stringify(data));

export const mockApi = {
  async login(email, password) {
    await delay();
    if (email === 'demo@academiacrm.com' && password === 'demo123') {
      return { access_token: 'mock-jwt-token', token_type: 'bearer' };
    }
    throw { response: { data: { detail: 'Incorrect email or password' }, status: 401 } };
  },

  async register(name, email, password) {
    await delay();
    if (email === 'demo@academiacrm.com') {
      throw { response: { data: { detail: 'Email already registered' }, status: 400 } };
    }
    return { access_token: 'mock-jwt-token', token_type: 'bearer' };
  },

  async getMe() {
    await delay();
    return clone(DEMO_USER);
  },

  async getLeads() {
    await delay();
    return clone(leadsStore);
  },

  async createLead(data) {
    await delay();
    const newLead = {
      ...data,
      _id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    leadsStore = [newLead, ...leadsStore];
    return clone(newLead);
  },

  async updateLead(id, data) {
    await delay();
    leadsStore = leadsStore.map((lead) =>
      lead._id === id ? { ...lead, ...data, updated_at: new Date().toISOString() } : lead
    );
    return clone(leadsStore.find((l) => l._id === id));
  },

  async deleteLead(id) {
    await delay();
    leadsStore = leadsStore.filter((lead) => lead._id !== id);
    followupsStore = followupsStore.filter((f) => f.lead_id !== id);
    return { message: 'Lead deleted successfully' };
  },

  async getFollowups() {
    await delay();
    return clone(followupsStore);
  },

  async createFollowup(data) {
    await delay();
    const lead = leadsStore.find((l) => l._id === data.lead_id);
    const newFollowup = {
      ...data,
      _id: `followup-${Date.now()}`,
      lead_name: lead?.institution_name || 'Unknown Institution',
      is_completed: false,
      created_at: new Date().toISOString(),
    };
    followupsStore = [...followupsStore, newFollowup];
    return clone(newFollowup);
  },

  async updateFollowup(id, data) {
    await delay();
    followupsStore = followupsStore.map((f) => (f._id === id ? { ...f, ...data } : f));
    return clone(followupsStore.find((f) => f._id === id));
  },

  async getDashboardStats() {
    await delay();
    const activeLeads = leadsStore.filter(
      (l) => !['Closed', 'Closed (Lost)'].includes(l.lead_status)
    ).length;
    const closedDeals = leadsStore.filter((l) => l.lead_status === 'Closed').length;
    const pendingFollowups = followupsStore.filter((f) => !f.is_completed).length;

    const statusMap = {};
    const typeMap = {};
    leadsStore.forEach((lead) => {
      statusMap[lead.lead_status] = (statusMap[lead.lead_status] || 0) + 1;
      typeMap[lead.institution_type] = (typeMap[lead.institution_type] || 0) + 1;
    });

    return {
      summary: {
        total_institutions: leadsStore.length,
        active_leads: activeLeads,
        meetings: pendingFollowups,
        closed_deals: closedDeals,
      },
      status_distribution: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
      type_distribution: Object.entries(typeMap).map(([name, value]) => ({ name, value })),
      recent_activity: clone(leadsStore.slice(0, 5)),
      report: MOCK_DASHBOARD_STATS.report,
    };
  },

  async generateAI(taskType, prompt, contextData) {
    await delay(600);
    return { result: generateMockAIResponse(taskType, contextData, prompt) };
  },

  reset() {
    leadsStore = [...MOCK_LEADS];
    followupsStore = [...MOCK_FOLLOWUPS];
  },
};

export default mockApi;
