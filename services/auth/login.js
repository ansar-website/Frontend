import axios from 'axios';

if (axios.defaults?.headers?.common?.Authorization) delete axios.defaults.headers.common.Authorization;
const Login = (values) => axios.post('/auth/rest_auth/login/', values);

const Logout = () => axios.post('/auth/rest_auth/logout/');

const LoginServ = {
  Login,
  Logout,
};

export default LoginServ;
