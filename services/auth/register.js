import axios from 'axios';

if (axios.defaults?.headers?.common?.Authorization) delete axios.defaults.headers.common.Authorization;

const Register = (values) => axios.post('/auth/registration/register', values);

const RegisterServ = {
  Register,
};

export default RegisterServ;
