import axios from 'axios';

const GetDegrees = () => axios.get(`lms/course/certificates/my/`);

const GetDegree = (id) => axios.get(`lms/course/certificates/${id}/`);

const DegreesService = {
  GetDegrees,
  GetDegree,
};

export default DegreesService;
