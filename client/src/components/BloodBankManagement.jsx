import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BloodBankManagement = () => {
  const { hospitalId } = useParams();
  const [bloodRecords, setBloodRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    bloodType: "",
    availability: "",
    expiryDate: "",
  });

  useEffect(() => {
    axios.get(`/blood-bank/${hospitalId}`).then((response) => {
      setBloodRecords(response.data);
    });
  }, [hospitalId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const addBloodRecord = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/blood-bank", {
        ...newRecord,
        hospitalId,
      });
      axios.get(`/blood-bank/${hospitalId}`).then((response) => {
        setBloodRecords(response.data);
      });
    } catch (error) {
      console.error("Error adding blood record:", error);
    }
  };

  const deleteBloodRecord = async (id) => {
    try {
      await axios.delete(`/blood-bank/${id}`);
      axios.get(`/blood-bank/${hospitalId}`).then((response) => {
        setBloodRecords(response.data);
      });
    } catch (error) {
      console.error("Error deleting blood record:", error);
    }
  };

  return (
    <div className="container">
      <h2>Manage Blood Bank Records</h2>
      <form onSubmit={addBloodRecord}>
        <input
          type="text"
          name="bloodType"
          value={newRecord.bloodType}
          onChange={handleInputChange}
          placeholder="Blood Type"
        />
        <input
          type="number"
          name="availability"
          value={newRecord.availability}
          onChange={handleInputChange}
          placeholder="Availability"
        />
        <input
          type="date"
          name="expiryDate"
          value={newRecord.expiryDate}
          onChange={handleInputChange}
          placeholder="Expiry Date"
        />
        <button type="submit">Add Record</button>
      </form>

      <ul>
        {bloodRecords.map((record) => (
          <li key={record._id}>
            {record.bloodType} - {record.availability} units available -{" "}
            {new Date(record.expiryDate).toLocaleDateString()}
            <button onClick={() => deleteBloodRecord(record._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BloodBankManagement;
