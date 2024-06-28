import axios from 'axios';

const UpdateToken = (token) => axios.post('/auth/rest_auth/token/refresh/', { refresh: token });

const GetProfile = () => axios.get('/auth/profile/');

const UpdateProfile = (profile) => axios.put('/auth/profile/', profile);

const VerifyEmail = (key) => axios.post('/auth/registration/verify-email/', { key });

const ChangePassword = (payload) => axios.post('/auth/rest_auth/password/change/', payload);

const ProfileServ = {
  UpdateToken,
  GetProfile,
  UpdateProfile,
  VerifyEmail,
  ChangePassword,
};
export default ProfileServ;
