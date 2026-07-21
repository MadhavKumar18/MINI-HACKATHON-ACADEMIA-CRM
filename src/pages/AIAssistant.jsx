import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, BrainCircuit, MessageSquare, Briefcase, Mail } from 'lucide-react';
import { Card, Form, Button, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { getId } from '../utils/helpers';

const AIAssistant = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [taskType, setTaskType] = useState('lead_priority');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.getLeads();
        setLeads(res.data);
        if (res.data.length > 0) {
          setSelectedLead(getId(res.data[0]));
        }
      } catch (err) {
        setError('Failed to load leads for AI context.');
        console.error(err);
      }
    };
    fetchLeads();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedLead) {
      setError('Please select a lead first.');
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const leadData = leads.find((l) => getId(l) === selectedLead);
      const res = await api.generateAI({
        prompt: prompt || 'Generate response based on task type',
        task_type: taskType,
        context_data: leadData,
      });
      setResponse(res.data.result);
    } catch (err) {
      setError('Failed to generate AI response.');
      console.error(err);
    }
    setLoading(false);
  };

  const tasks = [
    { id: 'lead_priority', icon: <Briefcase size={18} />, label: 'Lead Priority Analysis', desc: 'Score and rank lead urgency' },
    { id: 'next_action', icon: <BrainCircuit size={18} />, label: 'Next Best Action', desc: 'Get recommended sales steps' },
    { id: 'email', icon: <Mail size={18} />, label: 'Personalized Email', desc: 'Draft outreach email' },
    { id: 'followup_suggestion', icon: <MessageSquare size={18} />, label: 'Follow-up Suggestions', desc: 'Plan follow-up cadence' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 d-flex align-items-center">
          <Sparkles className="text-primary me-2" /> AI Lead Intelligence
        </h2>
        <p className="text-muted">
          Mock AI-powered sales assistant — analyzes leads and generates actionable insights.
        </p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Row>
        <Col lg={5} className="mb-4 mb-lg-0">
          <Card className="custom-card h-100">
            <Card.Body className="p-4">
              <Form onSubmit={handleGenerate}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">1. Select Target Lead</Form.Label>
                  <Form.Select value={selectedLead} onChange={(e) => setSelectedLead(e.target.value)} required>
                    <option value="">Select a lead context...</option>
                    {leads.map((lead) => (
                      <option key={getId(lead)} value={getId(lead)}>
                        {lead.institution_name} — {lead.lead_status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">2. Select Task Type</Form.Label>
                  <div className="d-flex flex-column gap-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 border rounded ${taskType === task.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setTaskType(task.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setTaskType(task.id)}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`me-3 ${taskType === task.id ? 'text-primary' : 'text-muted'}`}>
                            {task.icon}
                          </div>
                          <div>
                            <div className={`fw-medium ${taskType === task.id ? 'text-primary' : ''}`}>
                              {task.label}
                            </div>
                            <small className="text-muted">{task.desc}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">3. Additional Instructions (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="E.g., Keep the tone formal and mention our recent discount..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 fw-bold d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="me-2" /> Generate AI Output
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="custom-card h-100 bg-dark text-white border-0" style={{ minHeight: '500px' }}>
            <Card.Header className="border-bottom border-secondary bg-transparent">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <BrainCircuit className="text-info me-2" /> AI Output
              </h5>
            </Card.Header>
            <Card.Body className="overflow-auto" style={{ maxHeight: '600px' }}>
              {response ? (
                <div>
                  <Badge bg="info" className="mb-3 px-3 py-2 rounded-pill">
                    {tasks.find((t) => t.id === taskType)?.label}
                  </Badge>
                  <div
                    className="bg-secondary bg-opacity-25 p-4 rounded-3 border border-secondary border-opacity-50"
                    style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}
                  >
                    {response}
                  </div>
                </div>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-50 py-5">
                  <Sparkles size={48} className="mb-3" />
                  <p>Select a lead and task type, then click Generate</p>
                  <small>Uses mock AI by default — no API key required</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIAssistant;
