
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/1+.png";

const INVENTORY_EMAIL = "inventory@bdms.com";
const INVENTORY_PASSWORD = "Blood@123";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useSelector((state) => state.auth || {});
  const { loading, error, user } = auth;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim();
    const password = formData.password;

    if (email === INVENTORY_EMAIL && password === INVENTORY_PASSWORD) {
      navigate("/inventory");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (!user) return;

    if (user.isAdmin === true) {
      navigate("/reports");
      return;
    }

    if (user.isHospital === true) {
      fetch(`http://localhost:5050/hospitals/profile/${user._id}`)
        .then((res) => res.json())
        .then((profile) => {
          if (profile?.type === "Blood Inventory") {
            navigate("/inventory");
          } else {
            navigate("/hospital-dash");
          }
        });
      return;
    }

    const from = location.state?.from;
    if (from === "/appointments") {
      const { urgentHospitalId, urgentBloodType } = location.state || {};
      navigate("/appointments", {
        replace: true,
        state: urgentHospitalId ? { urgentHospitalId, urgentBloodType } : undefined,
      });
      return;
    }

    navigate("/home");
  }, [user, navigate, location.state]);



  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="login-page container-fluid">
      <div className="row min-vh-100 align-items-center">

        <div className="col-md-7 d-flex justify-content-end">
          <div style={{ width: "100%", maxWidth: "480px" }}>

            <h4 className="text-center mb-4" className="text-danger fw-semibold">
              Login
            </h4>

            <div className="form-wrapper">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label small text-muted">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Your Password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>


              <p className="small mb-1">
                Forget password?{" "}
                <Link to="/forget-password" className="text-danger text-decoration-none">
                  Reset here
                </Link>
              </p>

              <p className="small mb-0">
                Don’t have an account?{" "}
                <Link to="/register" className="text-danger text-decoration-none">
                  Sign up
                </Link>
              </p>

            </div>
          </div>
        </div>

        <div className="col-md-5 d-flex justify-content-start align-items-center d-none d-md-flex">
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
