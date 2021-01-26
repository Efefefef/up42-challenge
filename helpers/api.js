import axios from 'axios';

const handleResponse = (response, expectedStatusCode = 200) => {
  if (response.status === expectedStatusCode) return response.data;
  throw new Error(`Status code: ${response.response.status}
	\n${JSON.stringify(response.response, null, 2)}`);
};

const handleError = (error, expectedStatusCode) => {
  if (error.response) {
    if (error.response.status !== expectedStatusCode) {
      throw new Error(`Status code: ${error.response.status}
			\n${JSON.stringify(error.response, null, 2)}`);
    }
    return error.response.data;
  }
  throw new Error('The request was made but no response was received');
};

const api = {
  get: (url, headers, expectedStatusCode) => axios.get(url, { headers })
    .then(response => handleResponse(response, expectedStatusCode))
    .catch(error => handleError(error, expectedStatusCode)),
  post: (url, data, headers, expectedStatusCode) => axios.post(url, data, { headers })
      .then(response => handleResponse(response, expectedStatusCode))
      .catch(error => handleError(error, expectedStatusCode)),
  delete: (url, headers, expectedStatusCode) => axios.delete(url, { headers })
    .then(response => handleResponse(response, expectedStatusCode))
    .catch(error => handleError(error, expectedStatusCode)),
};

export default api;
