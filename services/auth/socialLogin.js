import axios from 'axios';

if (axios.defaults?.headers?.common?.Authorization) delete axios.defaults.headers.common.Authorization;

const GoogleLogin = (payload) => axios.post('/auth/google/', payload);

const FacebookLogin = (payload) => axios.post('/auth/facebook/', payload);

const SocialLogin = {
  GoogleLogin,
  FacebookLogin,
};

export default SocialLogin;
