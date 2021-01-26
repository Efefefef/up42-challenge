import api from '../helpers/api';
import { HOST, PROJECT_ID, PROJECT_API_KEY } from '../../config';
import { workflowDataSample, taskTaskSample, invalidToken } from '../testData';

const baseUrl = `https://${HOST}`;
const endpoint = `${baseUrl}/projects/${PROJECT_ID}/workflows`;

describe('Add tasks to workflow', () => {
  let ACCESS_TOKEN;
  let workflowId;

  beforeAll(async () => {
    ACCESS_TOKEN = await api.getAccessToken({ HOST, PROJECT_ID, PROJECT_API_KEY });
    const workflowResponse = await api.post(endpoint, ACCESS_TOKEN, workflowDataSample);
    workflowId = workflowResponse.data.id;
  });

  afterAll(async () => {
    await api.delete(`${endpoint}/${workflowId}`, ACCESS_TOKEN, 204);
  })

  it('Correct data -> ok', async () => {
    const response = await api.post(`${endpoint}/${workflowId}/tasks`, ACCESS_TOKEN, taskTaskSample);
    expect(response.error).toBe(null);
  });

  it('Invalid access token -> 401', async () => {
    const response = await api.post(`${endpoint}/${workflowId}/tasks`, invalidToken, taskTaskSample, 401);
    expect(response.error.message).toBe('Unauthorized');
  });

  it('Missing data -> 405', async () => {
    const response = await api.post(`${endpoint}/workflows`, ACCESS_TOKEN, {}, 405);
    expect(response.error.message).toBe('Request method \'POST\' not supported'); // <- Incorrect error on your side
  });
});
