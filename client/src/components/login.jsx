// src/components/login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthMessage } from '../features/authSlice';
import donorIllustration from '../assets/donor.png';
import mlogo from '../assets/mlogo.jpg';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 👇 this avoids crashes if state.auth is undefined for any reason
  const auth = useSelector((state) => state.auth || {});
  const { loading, error, message, user } = auth;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // ✅ after login, check verification
  useEffect(() => {
    if (!user) return;

    if (user.isVerified) {
      // go to main home page
      navigate('/home');
    } else {
      alert('Please verify your email before logging in.');
      // optional: logout / clear user here later
    }
  }, [user, navigate]);

  // show errors as alerts for now
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="auth-page container-fluid">
      <div className="row align-items-center min-vh-100">
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

          <h2 className="auth-title mb-4">Login</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="small text-muted mb-1">Forget password?</p>
          <p className="small">
            Don't have an account?{' '}
            <Link to="/register" className="text-danger text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>

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

export default Login;
