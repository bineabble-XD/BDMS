import React from "react";
import { useLocation, Link } from "react-router-dom";

const HospitalManageRequest = () => {
  const location = useLocation();
  const data = location.state?.item || location.state?.p;

  if (!data) {
    return <h3>No appointment selected</h3>;
  }

  return (
    <div className="container py-5">
      <h2>Manage Request</h2>

      <div className="card p-4 shadow-sm mt-3">
        <div className="d-flex justify-content-between">
          <div>
            <h4>{data.name}</h4>
            <p>
              <strong>Requested:</strong> {data.time}
            </p>
            <p>
              <strong>Donor Type:</strong> O+
            </p>
          </div>

          <div className="text-end">
            <p>23 - Male</p>
            <p>📧 abbas@gmail.com</p>
            <p>📞 +968 99999999</p>
          </div>
        </div>

        <hr />

        <h6>Reason for Request</h6>
        <input
          className="form-control mb-3"
          defaultValue="Scheduled follow-up donation as per previous visit..."
        />

        <div className="d-flex gap-3">
          <button className="btn btn-danger">Approve</button>
          <button className="btn btn-outline-dark">Decline</button>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/hospital-appointments" className="btn btn-secondary">
          Back
        </Link>
      </div>
    </div>
  );
};

export default HospitalManageRequest;
