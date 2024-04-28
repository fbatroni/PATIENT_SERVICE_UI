import { useState, useEffect } from "react";
import { PatientService } from "../utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography } from "@mui/material";

const PatientsList = () => {
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    console.log("use effect called");
    const fetchPatients = async () => {
      try {
        // try to get the data from the api
        const data = await PatientService.getAllPatients();
        setPatientData(data);
      } catch (error) {
        console.log("Failed to fetch patients", error);
      }
    };

    fetchPatients();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "full_name", headerName: "Full Name", width: 200 },
    { field: "dob", headerName: "Date of Birth", width: 110 },
    { field: "gender", headerName: "Gender", width: 90 },
    { field: "physician_id", headerName: "Physician ID", width: 110 },
    { field: "ssn", headerName: "SSN", width: 130 },
    { field: "address", headerName: "Address", width: 200 },
  ];

  const handleRowClick = async (params) => {
    try {
      const patientDetails = await PatientService.getPatientByPatientId(
        params.id
      );
      setSelectedPatient(patientDetails);
      setOpenModal(true);
    } catch (error) {
      console.log("error loading selected patient");
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={patientData}
        columns={columns}
        pageSize={5}
        checkboxSelection
        onRowClick={handleRowClick}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="patient-details-title"
        aria-describedby="patient-details-description"
      >
        <Box sx={modalStyle}>
          <Typography id="patient-details-title" variant="h6" component="h2">
            Patient Details
          </Typography>
          {selectedPatient ? (
            <>
              <Typography id="patient-details-description" sx={{ mt: 2 }}>
                Full Name: {selectedPatient.full_name}
              </Typography>
              <Typography>Date of Birth: {selectedPatient.dob}</Typography>
              <Typography>Gender: {selectedPatient.gender}</Typography>
              <Typography>SSN: {selectedPatient.ssn}</Typography>
              <Typography>Address: {selectedPatient.address}</Typography>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default PatientsList;
