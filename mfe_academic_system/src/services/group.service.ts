import api from '../services/api.service';

export const getGroups = async () => {
  const res = await api.get('/groups');
  return res.data;
};
