import axios from 'axios';

const handleResponse = (response, expectedStatusCode = 200) => {
  if (response.status === expectedStatusCode) return response.data;
  throw new Error(`Status code: ${response.response.status}
	
	\n${response.response}`); //\n${JSON.stringify(response.response, null, 2)}`);
};

const handleError = (error, expectedStatusCode) => {
  throw new Error(error)
  // if (expectedStatusCode && error.response.status !== expectedStatusCode) {
  // throw new Error(`Status code: ${error.response.status}
	// 		\n${JSON.stringify(error.response, null, 2)}`);
  // return error;
};

const api = {
  getAccessToken: ({ HOST, PROJECT_ID, PROJECT_API_KEY }) => axios.post(
    `https://${PROJECT_ID}:${PROJECT_API_KEY}@${HOST}/oauth/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => handleResponse(response))
    .then(({ access_token }) => access_token)
    .catch(error => handleError(error)),
  get: (url, ACCESS_TOKEN, expectedStatusCode) => axios.get(url, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  })
    .then(response => handleResponse(response, expectedStatusCode))
    .catch(error => handleError(error, expectedStatusCode)),
  post: (url, ACCESS_TOKEN, data, expectedStatusCode) => axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  })
    .then(response => handleResponse(response, expectedStatusCode))
    .catch(error => handleError(error, expectedStatusCode)),
  delete: (url, ACCESS_TOKEN, expectedStatusCode) => axios.delete(url, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  })
    .then(response => handleResponse(response, expectedStatusCode))
    .catch(error => handleError(error, expectedStatusCode)),
};

export default api;
