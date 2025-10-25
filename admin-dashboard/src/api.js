import { BASE_URL } from './config';

export const fetchAPI = (endpoint, options = {}) => {
  return fetch(`${BASE_URL}${endpoint}`, options)
    .then(res => res.json())
    .catch(err => console.error(err));
};
