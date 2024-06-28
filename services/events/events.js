import axios from 'axios';

const GetEvents = (filter) => axios.get(`/event/event/${filter || ''}`);

const GetSingleEvent = (id) => axios.get(`/event/event/${id}`);

const EventsService = {
  GetEvents,
  GetSingleEvent,
};
export default EventsService;
