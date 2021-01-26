import axios from 'axios';
import { PROJECT_ID, PROJECT_API_KEY } from '../config';

const HOST = 'api.up42.com';
const endpoint = `https://${PROJECT_ID}:${PROJECT_API_KEY}@${HOST}/oauth/token`;

test('Retrieve an access token', () =>
  axios.post(endpoint, 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(response => {
        console.log(response.data.access_token)
        expect(response.data.access_token).toBe(null)
      }
    )
)



