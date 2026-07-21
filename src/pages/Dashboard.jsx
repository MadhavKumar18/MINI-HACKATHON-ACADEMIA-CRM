import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, Calendar, Target, TrendingUp, IndianRupee, BarChart3 } from 'lucide-react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { formatDate, getId } from '../utils/helpers';

const COLORS = ['#0d6efd', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats', error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-muted p-4">Loading dashboard...</div>;
  if (!stats) return <div className="text-danger p-4">Failed to load dashboard data.</div>;

  const StatCard = ({ title, value, icon, bgClass, textClass }) => (
    <Card className="custom-card mb-4">
      <Card.Body className="d-flex align-items-center justify-content-between p-4">
        <div>
          <p className="text-muted mb-1 fw-bold small">{title}</p>
          <h2 className="mb-0 fw-bold">{value}</h2>
        </div>
        <div className={`p-3 rounded-circle ${bgClass} ${textClass}`}>{icon}</div>
      </Card.Body>
    </Card>
  );

  const report = stats.report || {};

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Dashboard & Reporting</h2>
        <p className="text-muted">Sales pipeline overview and performance metrics.</p>
      </div>

      <Row>
        <Col md={6} lg={3}>
          <StatCard title="Total Institutions" value={stats.summary.total_institutions} icon={<Building2 size={24} />} bgClass="bg-primary bg-opacity-10" textClass="text-primary" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Active Leads" value={stats.summary.active_leads} icon={<Users size={24} />} bgClass="bg-info bg-opacity-10" textClass="text-info" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Pending Follow-ups" value={stats.summary.meetings} icon={<Calendar size={24} />} bgClass="bg-warning bg-opacity-10" textClass="text-warning" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Closed Deals" value={stats.summary.closed_deals} icon={<Target size={24} />} bgClass="bg-success bg-opacity-10" textClass="text-success" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3}>
          <StatCard title="Conversion Rate" value={report.conversion_rate || '—'} icon={<TrendingUp size={24} />} bgClass="bg-success bg-opacity-10" textClass="text-success" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Avg Deal Size" value={report.avg_deal_size || '—'} icon={<IndianRupee size={24} />} bgClass="bg-primary bg-opacity-10" textClass="text-primary" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Pipeline Value" value={report.pipeline_value || '—'} icon={<BarChart3 size={24} />} bgClass="bg-info bg-opacity-10" textClass="text-info" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Top Lead Source" value={report.top_source || '—'} icon={<TrendingUp size={24} />} bgClass="bg-warning bg-opacity-10" textClass="text-warning" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Card className="custom-card h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">Lead Status Distribution</Card.Title>
              {stats.status_distribution.length > 0 ? (
                <>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.status_distribution} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value">
                          {stats.status_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center mt-2 gap-2">
                    {stats.status_distribution.map((entry, index) => (
                      <div key={index} className="d-flex align-items-center small text-muted">
                        <span className="rounded-circle me-1" style={{ width: 10, height: 10, backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name}: {entry.value}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted text-center py-5">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="custom-card h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">Institution Types</Card.Title>
              {stats.type_distribution.length > 0 ? (
                <div style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.type_distribution}>
                      <XAxis dataKey="name" stroke="#6c757d" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6c757d" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#f8f9fa' }} />
                      <Bar dataKey="value" fill="#6f42c1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted text-center py-5">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        <Card.Body>
          <Card.Title className="fw-bold mb-4">Recent Activity</Card.Title>
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Institution</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((lead) => (
                  <tr key={getId(lead)}>
                    <td className="fw-medium">{lead.institution_name}</td>
                    <td>{lead.contact_person}</td>
                    <td>{lead.institution_type}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2">
                        {lead.lead_status}
                      </span>
                    </td>
                    <td className="text-muted">{formatDate(lead.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No recent activity found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
