import { Alert } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const DemoModeBanner = () => {
  const { demoMode } = useAuth();

  if (!demoMode) return null;

  return (
    <Alert variant="info" className="mb-4 py-2 small mb-0 rounded-0 border-0 border-bottom">
      <strong>Demo Mode:</strong> Backend unavailable — running with mock data.
      Login with <code>demo@academiacrm.com</code> / <code>demo123</code>
    </Alert>
  );
};

export default DemoModeBanner;
