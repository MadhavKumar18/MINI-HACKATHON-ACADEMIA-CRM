import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DemoModeBanner from './DemoModeBanner';
import { LayoutDashboard, Users, CalendarCheck, Sparkles, LogOut, GraduationCap } from 'lucide-react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} className="me-2" /> },
    { path: '/leads', label: 'Leads', icon: <Users size={20} className="me-2" /> },
    { path: '/followups', label: 'Follow-ups', icon: <CalendarCheck size={20} className="me-2" /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <Sparkles size={20} className="me-2" /> },
  ];

  return (
    <div className="sidebar d-flex flex-column p-3">
      <div className="d-flex align-items-center mb-4 mt-2 px-2">
        <div className="bg-primary p-2 rounded me-2">
          <GraduationCap className="text-white" size={24} />
        </div>
        <h4 className="mb-0 text-white fw-bold fs-5">Academia CRM</h4>
      </div>
      <hr className="text-secondary" />
      <Nav className="flex-column flex-grow-1 mt-2">
        {navItems.map((item) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={item.path}
            className={`d-flex align-items-center mb-2 p-2 ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
      <hr className="text-secondary" />
      <div className="px-2 pb-3">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <Container fluid className="p-0 overflow-hidden vh-100">
      <Row className="g-0 h-100">
        <Col md={3} lg={2} className="d-none d-md-block p-0">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="d-flex flex-column p-0 h-100">
          <Navbar bg="white" className="border-bottom px-4 shadow-sm py-3 justify-content-end">
            <div className="d-flex align-items-center">
              <div className="text-end me-3">
                <div className="fw-bold">{user?.name}</div>
                <div className="text-muted small">{user?.email}</div>
              </div>
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 40, height: 40 }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </Navbar>
          <DemoModeBanner />
          <main className="flex-grow-1 p-4 overflow-auto bg-light">
            <Container fluid className="py-2">
              {children}
            </Container>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
