import axios from 'axios';

const VACANCY_API_URL = 'http://localhost:8082/api/vacancies';

export const getAllVacancies = async () => {
  const response = await axios.get(VACANCY_API_URL);
  return response.data;
};

export const getVacanciesByCompany = async (companyId) => {
  const response = await axios.get(`${VACANCY_API_URL}/company/${companyId}`);
  return response.data;
};

export const createVacancy = async (vacancyData) => {
  const response = await axios.post(VACANCY_API_URL, vacancyData);
  return response.data;
};

export const deleteVacancy = async (id) => {
  const response = await axios.delete(`${VACANCY_API_URL}/${id}`);
  return response.data;
};