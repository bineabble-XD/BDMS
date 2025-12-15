import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBloodBankView = () => {
  const [bloodRecords, setBloodRecords] = useState([]);

  useEffect(() => {
    axios.get("/blood-bank/all").then((response) => {
      setBloodRecords(response.data);
    });
  }, []);

  return (
    <div className="container">
      <h2>View All Blood Bank Records</h2>
      <ul>
        {bloodRecords.map((record) => (
          <li key={record._id}>
            {record.bloodType} - {record.availability} units available -{" "}
            {new Date(record.expiryDate).toLocaleDateString()} -{" "}
            {record.hospitalId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBloodBankView;
