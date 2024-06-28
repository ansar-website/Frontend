import axios from 'axios';

const Reset = (payload) => axios.post('/auth/rest_auth/password/reset/', payload);

const ResetConfirm = (payload) => axios.post('/auth/rest_auth/password/reset/confirm/', payload);

const ResetService = {
  Reset,
  ResetConfirm,
};

export default ResetService;
