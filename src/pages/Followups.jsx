import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, CheckCircle, Clock } from 'lucide-react';
import { Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { formatDateTime, getId } from '../utils/helpers';

const Followups = () => {
  const [followups, setFollowups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    lead_id: '',
    notes: '',
    reminder_date: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, followupsRes] = await Promise.all([api.getLeads(), api.getFollowups()]);
      setLeads(leadsRes.data);
      setFollowups(
        followupsRes.data.sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date))
      );
    } catch (err) {
      setError('Failed to load follow-ups.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createFollowup(formData);
      setShowModal(false);
      setFormData({ lead_id: '', notes: '', reminder_date: '' });
      fetchData();
    } catch (err) {
      setError('Failed to save follow-up.');
      console.error(err);
    }
  };

  const markCompleted = async (followup) => {
    try {
      await api.updateFollowup(getId(followup), { is_completed: true });
      fetchData();
    } catch (err) {
      setError('Failed to update follow-up.');
      console.error(err);
    }
  };

  const pendingCount = followups.filter((f) => !f.is_completed).length;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Sales Follow-up Automation</h2>
          <p className="text-muted mb-0">
            Track scheduled meetings and tasks — {pendingCount} pending follow-up{pendingCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <Button variant="primary" className="d-flex align-items-center fw-bold shadow-sm" onClick={() => setShowModal(true)}>
          <Plus size={20} className="me-2" /> Add Follow-up
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Card className="custom-card">
        <Card.Body className="p-0">
          {loading ? (
            <div className="p-5 text-center text-muted">Loading follow-ups...</div>
          ) : followups.length === 0 ? (
            <div className="p-5 text-center">
              <h5 className="text-muted mb-3">No follow-ups scheduled</h5>
              <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                Schedule your first follow-up
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Reminder Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {followups.map((f) => (
                  <tr key={getId(f)} className="align-middle">
                    <td className="px-4 fw-bold">{f.lead_name}</td>
                    <td className="px-4" style={{ maxWidth: '300px' }}>
                      <span className="text-truncate d-inline-block w-100">{f.notes}</span>
                    </td>
                    <td className="px-4">
                      <div className="d-flex align-items-center text-muted">
                        <Clock size={14} className="me-2" />
                        {formatDateTime(f.reminder_date)}
                      </div>
                    </td>
                    <td className="px-4">
                      {f.is_completed ? (
                        <Badge bg="success" className="rounded-pill px-3 py-2 fw-normal">
                          <CheckCircle size={14} className="me-1" /> Completed
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 fw-normal">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 text-end">
                      {!f.is_completed && (
                        <Button variant="outline-success" size="sm" className="fw-bold" onClick={() => markCompleted(f)}>
                          Mark Completed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Schedule Follow-up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="followupForm" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Select Lead</Form.Label>
              <Form.Select name="lead_id" required value={formData.lead_id} onChange={handleInputChange}>
                <option value="">Choose a lead...</option>
                {leads.map((lead) => (
                  <option key={getId(lead)} value={getId(lead)}>
                    {lead.institution_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Reminder Date & Time</Form.Label>
              <Form.Control type="datetime-local" name="reminder_date" required value={formData.reminder_date} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" required value={formData.notes} onChange={handleInputChange} placeholder="What is this follow-up about?" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" type="submit" form="followupForm">Save Follow-up</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Followups;
