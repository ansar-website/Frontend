import axios from 'axios';

const SubmitContact = (payload) => axios.post('/general_settings/contact_us/', payload);

const ContactService = {
  SubmitContact,
};
export default ContactService;
