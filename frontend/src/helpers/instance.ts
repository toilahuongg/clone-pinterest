import axios from 'axios';

const instance = axios.create({ baseURL: `${process.env.REACT_APP_SERVER}/api` });

instance.defaults.headers.common.Authorization = window.localStorage.getItem('token') || '';
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);
export default instance;
