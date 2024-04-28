// In AddPatientForm.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { PatientService } from "../utils/api";

const AddPatientForm = () => {
  const [dob, setDob] = useState("");
  const [ssn, setSsn] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const validateField = (name, value) => {
    switch (name) {
      case "dob":
        if (!value) return "Date of Birth is required";
        // Additional validations like date format can be added here
        break;
      case "ssn":
        if (!value) return "SSN is required";
        // Additional validations like SSN format can be added here
        break;
      default:
        return "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    if (name === "dob") setDob(value);
    if (name === "ssn") setSsn(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming createPatient method exists in your PatientService
    if (!errors.dob && !errors.ssn && dob && ssn) {
      try {
        await PatientService.createPatient({ dob, ssn });
        navigate("/patients"); // Navigate back to the list after successful creation
      } catch (error) {
        console.error("Failed to create patient", error);
      }
    }
  };

  if (location.pathname === "/patients") {
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          name="dob"
          value={dob}
          onChange={handleChange}
          error={!!errors.dob}
          helperText={errors.dob}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Social Security Number"
          name="ssn"
          value={ssn}
          onChange={handleChange}
          error={!!errors.ssn}
          helperText={errors.ssn}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
          Add Patient
        </Button>
      </Box>
    );
  }
};

export default AddPatientForm;
