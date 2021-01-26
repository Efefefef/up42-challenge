import api from '../helpers/api';
import { PROJECT_ID, PROJECT_API_KEY } from '../config';

const HOST = 'api.up42.com';
const endpoint = `https://${PROJECT_ID}:${PROJECT_API_KEY}@${HOST}/oauth/token`;

test('Retrieve an access token', async () => {
  const response = await api.post(endpoint, 'grant_type=client_credentials', {
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  const accessToken = response.access_token;
  console.log(accessToken)
});



