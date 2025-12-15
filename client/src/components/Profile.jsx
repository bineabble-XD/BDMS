import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; 

  return (
    <div className="profile-page">
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={bdmslogo}
              alt="BDMS Logo"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <span className="nav-link active-link">My Profile</span>
          </nav>
        </div>
      </header>

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Profile</h5>
                <Link to="/home" className="btn btn-sm btn-outline-secondary">
                  Back to Home
                </Link>
                <Link to="/forget-password" className="btn btn-sm btn-outline-secondary">
                  Reset Passwoword
                </Link>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="profile-icon rounded-circle me-3 d-flex align-items-center justify-content-center">
                    {user.fName
                      ? user.fName.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="mb-0">{user.fName || "User"}</h4>
                    <small className="text-muted">{user.email}</small>
                  </div>
                </div>

                <dl className="row mb-0">
                  <dt className="col-sm-4">Full Name</dt>
                  <dd className="col-sm-8">{user.fName}</dd>

                  <dt className="col-sm-4">Email</dt>
                  <dd className="col-sm-8">{user.email}</dd>

                  <dt className="col-sm-4">Phone Number</dt>
                  <dd className="col-sm-8">{user.phoneNum}</dd>

                  <dt className="col-sm-4">Age</dt>
                  <dd className="col-sm-8">{user.Age}</dd>

                  <dt className="col-sm-4">Gender</dt>
                  <dd className="col-sm-8">{user.gender}</dd>

                  <dt className="col-sm-4">Blood Type</dt>
                  <dd className="col-sm-8">{user.bloodType}</dd>

                  <dt className="col-sm-4">Role</dt>
                  <dd className="col-sm-8">{user.role}</dd>

                  <dt className="col-sm-4">Address</dt>
                  <dd className="col-sm-8">{user.address}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
