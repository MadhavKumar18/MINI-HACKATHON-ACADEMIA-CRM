import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
    <Spinner animation="border" variant="primary" role="status" />
    <p className="text-muted mt-3 mb-0">{message}</p>
  </div>
);

export default LoadingSpinner;
