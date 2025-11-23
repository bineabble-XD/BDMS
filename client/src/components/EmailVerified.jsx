// EmailVerified.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import donorIllustration from '../assets/donor.png';
import mlogo from '../assets/mlogo.jpg';

const EmailVerified = () => {
  return (
    <div className="auth-page container-fluid">
      <div className="row align-items-center min-vh-100">
        {/* Left side */}
        <div className="col-md-6 auth-left">
          <div className="d-flex align-items-center gap-2 mb-4">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                objectFit: 'cover',
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span>{' '}
                <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <h2 className="auth-title mb-3">Email Verified</h2>

          <p className="text-muted mb-4">
            Your email has been successfully verified. You can now log in and
            start using the Blood Donation Management System.
          </p>

          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center px-3 py-2 rounded-3"
              style={{
                backgroundColor: '#f1f5f9',
              }}
            >
              <span
                className="me-2"
                style={{ fontSize: '1.5rem', lineHeight: 1 }}
              >
                ✅
              </span>
              <span className="fw-semibold">Verification completed</span>
            </div>
          </div>

          <Link to="/login" className="btn btn-danger w-100 mb-3">
            Go to Login
          </Link>

          <p className="small text-muted">
            Didn&apos;t mean to verify this account? Contact your administrator.
          </p>
        </div>

        {/* Right side */}
        <div className="col-md-6 auth-right text-center">
          <img
            src={donorIllustration}
            alt="Blood donor"
            className="auth-illustration img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
