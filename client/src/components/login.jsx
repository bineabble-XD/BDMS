import React from 'react';
import { Link } from 'react-router-dom';
import donorIllustration from '../assets/donor.png';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your backend login API here
    console.log('Login submitted');
  };

  return (
    <div className="auth-page container-fluid">
      <div className="row align-items-center min-vh-100">
        {/* LEFT SIDE – FORM */}
        <div className="col-md-6 auth-left">
          <div className="mb-4">
            <span className="brand-name">BDMS</span>
          </div>

          <h2 className="auth-title mb-4">Login</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100 mb-3">
              Login
            </button>
          </form>

          <p className="small text-muted mb-1">Forget password?</p>
          <p className="small">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-danger text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE – IMAGE */}
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
