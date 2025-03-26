import api from './api.service';

export const getEnrollments = async () => {
  const res = await api.get('/enrollments');
  return res.data;
};

export const createEnrollment = async (data: {
  studentId: string;
  groupId: string;
  createdBy: string;
}) => {
  const res = await api.post('/enrollments', data);
  return res.data;
};

export const deleteEnrollment = async (id: string) => {
  await api.delete(`/enrollments/${id}`);
};
