import axios from "axios";

export const BASE_URL = process.env.REACT_APP_PATIENT_SERVICE_API_BASE_URL;

const PatientService = {
  getAllPatients: async () => {
    const { data } = await axios.request({
      url: `${BASE_URL}/patients`,
    });

    const patientsList = data.map((patient) => {
      return {
        ...patient,
        full_name: patient.first_name + " " + patient.last_name,
      };
    });

    return patientsList;
  },
  getPatientByPatientId: async (patientId) => {
    const { data } = await axios.request({
      url: `${BASE_URL}/patients/${patientId}`,
    });

    return data;
  },
  updatePatient: (patient) => {},
};

export { PatientService };
