import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Card, Table, Button, Modal, Form, Row, Col, InputGroup, Badge, Alert } from 'react-bootstrap';
import { INSTITUTION_TYPES, LEAD_SOURCES, LEAD_STATUSES } from '../utils/constants';
import { filterLeads, getId } from '../utils/helpers';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const emptyForm = {
    institution_name: '',
    location: '',
    contact_person: '',
    email: '',
    phone: '',
    institution_type: '',
    student_strength: 0,
    program_interest: '',
    lead_source: '',
    lead_status: 'New Lead',
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads();
      setLeads(res.data);
    } catch (err) {
      setError('Failed to load leads.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'student_strength' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (currentLead) {
        await api.updateLead(getId(currentLead), formData);
      } else {
        await api.createLead(formData);
      }
      setShowModal(false);
      fetchLeads();
    } catch (err) {
      setError('Failed to save lead.');
      console.error(err);
    }
  };

  const openModal = (lead = null) => {
    if (lead) {
      setCurrentLead(lead);
      setFormData({ ...lead });
    } else {
      setCurrentLead(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete ${lead.institution_name}?`)) return;
    try {
      await api.deleteLead(getId(lead));
      fetchLeads();
    } catch (err) {
      setError('Failed to delete lead.');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Closed: 'success',
      'Closed (Lost)': 'danger',
      'New Lead': 'info',
      Contacted: 'warning',
      Negotiation: 'primary',
    };
    return (
      <Badge bg={map[status] || 'secondary'} className="rounded-pill px-3 py-2 fw-normal">
        {status}
      </Badge>
    );
  };

  const filteredLeads = filterLeads(leads, searchQuery);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Institution Lead Management</h2>
          <p className="text-muted mb-0">Manage academic institution leads and pipeline.</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center fw-bold shadow-sm" onClick={() => openModal()}>
          <Plus size={20} className="me-2" /> Add New Lead
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Card className="custom-card">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom bg-light bg-opacity-50">
            <InputGroup style={{ maxWidth: '320px' }}>
              <InputGroup.Text className="bg-white">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name, contact, location..."
                className="border-start-0 ps-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>

          {loading ? (
            <div className="p-5 text-center text-muted">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-5 text-center">
              <h5 className="text-muted mb-3">{searchQuery ? 'No matching leads' : 'No leads found'}</h5>
              {!searchQuery && (
                <Button variant="outline-primary" onClick={() => openModal()}>
                  Create your first lead
                </Button>
              )}
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={getId(lead)} className="align-middle">
                    <td className="px-4">
                      <div className="fw-bold">{lead.institution_name}</div>
                      <div className="text-muted small">{lead.location}</div>
                    </td>
                    <td className="px-4">
                      <div>{lead.contact_person}</div>
                      <div className="text-muted small">{lead.email}</div>
                    </td>
                    <td className="px-4">{lead.institution_type}</td>
                    <td className="px-4">{lead.student_strength?.toLocaleString()}</td>
                    <td className="px-4">{getStatusBadge(lead.lead_status)}</td>
                    <td className="px-4 text-end">
                      <Button variant="link" className="p-1 text-secondary" onClick={() => openModal(lead)}>
                        <Edit2 size={18} />
                      </Button>
                      <Button variant="link" className="p-1 text-danger" onClick={() => handleDelete(lead)}>
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{currentLead ? 'Edit Lead' : 'Add New Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="leadForm" onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Institution Name</Form.Label>
                  <Form.Control type="text" name="institution_name" required value={formData.institution_name} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Location</Form.Label>
                  <Form.Control type="text" name="location" required value={formData.location} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Contact Person</Form.Label>
                  <Form.Control type="text" name="contact_person" required value={formData.contact_person} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Email</Form.Label>
                  <Form.Control type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Phone</Form.Label>
                  <Form.Control type="text" name="phone" required value={formData.phone} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Institution Type</Form.Label>
                  <Form.Select name="institution_type" required value={formData.institution_type} onChange={handleInputChange}>
                    <option value="">Select Type</option>
                    {INSTITUTION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Student Strength</Form.Label>
                  <Form.Control type="number" name="student_strength" required min={0} value={formData.student_strength} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Program Interest</Form.Label>
                  <Form.Control type="text" name="program_interest" required value={formData.program_interest} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Lead Source</Form.Label>
                  <Form.Select name="lead_source" required value={formData.lead_source} onChange={handleInputChange}>
                    <option value="">Select Source</option>
                    {LEAD_SOURCES.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Lead Status</Form.Label>
                  <Form.Select name="lead_status" required value={formData.lead_status} onChange={handleInputChange}>
                    {LEAD_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" type="submit" form="leadForm">{currentLead ? 'Update Lead' : 'Save Lead'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leads;
