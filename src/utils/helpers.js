export const getId = (item) => item?._id || item?.id || '';

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const toDatetimeLocal = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

export const filterLeads = (leads, query) => {
  if (!query.trim()) return leads;
  const q = query.toLowerCase();
  return leads.filter(
    (lead) =>
      lead.institution_name?.toLowerCase().includes(q) ||
      lead.contact_person?.toLowerCase().includes(q) ||
      lead.location?.toLowerCase().includes(q) ||
      lead.lead_status?.toLowerCase().includes(q) ||
      lead.institution_type?.toLowerCase().includes(q)
  );
};
