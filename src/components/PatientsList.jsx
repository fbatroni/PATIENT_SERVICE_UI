import { useState, useEffect } from "react";
import { PatientService } from "../utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Modal, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PatientsList = () => {
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

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
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "first_name",
      headerName: "First Name",
      width: 200,
      editable: true,
    },
    { field: "last_name", headerName: "Last Name", width: 200, editable: true },
    { field: "dob", headerName: "Date of Birth", width: 110 },
    { field: "gender", headerName: "Gender", width: 90 },
    { field: "physician_id", headerName: "Physician ID", width: 110 },
    { field: "ssn", headerName: "SSN", width: 130 },
    { field: "address", headerName: "Address", width: 200, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleViewPatient(params.id)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeletePatient(params.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleViewPatient = async (patientId) => {
    try {
      const patientDetails = await PatientService.getPatientByPatientId(
        patientId
      );
      setSelectedPatient(patientDetails);
      setOpenViewModal(true);
    } catch (error) {
      console.log("error loading selected patient");
    }
  };
  const handleDeletePatient = (id) => {
    setPatientToDelete(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await PatientService.deletePatient(patientToDelete);
      const updatedPatients = patientData.filter(
        (patient) => patient.id !== patientToDelete
      );
      setPatientData(updatedPatients);
      setOpenDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete patient", error);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
    setOpenDeleteModal(false);
  };

  const handleProcessRowUpdate = async (newRow) => {
    try {
      await PatientService.updatePatient(newRow);
      const updatedRows = patientData.map((row) =>
        row.id === newRow.id ? newRow : row
      );
      setPatientData(updatedRows);
      return newRow;
    } catch (error) {
      console.error("Error updating patient", error);
      return;
    }
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
        processRowUpdate={handleProcessRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Modal
        open={openViewModal}
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

      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            component="h2"
          >
            Confirm Deletion
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this patient?
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-around" }}>
            <Button onClick={confirmDelete} color="error">
              Yes
            </Button>
            <Button onClick={() => setOpenDeleteModal(false)}>No</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default PatientsList;
