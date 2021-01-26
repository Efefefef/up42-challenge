import api from '../helpers/api';
import { HOST, PROJECT_ID, PROJECT_API_KEY } from '../config';

const baseUrl = `https://${HOST}`;
const endpoint = `${baseUrl}/projects/${PROJECT_ID}/workflows`;

describe('Create workflow', () => {
  let ACCESS_TOKEN;
  let workflowId;

  beforeAll(async () => {
    ACCESS_TOKEN = await api.getAccessToken({ HOST, PROJECT_ID, PROJECT_API_KEY });
  });

  afterAll(async () => {
    await api.delete(`${endpoint}/${workflowId}`, ACCESS_TOKEN, 204);
  })

  it('Correct data -> ok', async () => {
    const sampleData = {
      'name': 'QA coding challenge workflow',
      'description': 'Workflow description',
    }
    const workflowResponse = await api.post(endpoint, ACCESS_TOKEN, sampleData);
    workflowId = workflowResponse.data.id;
    expect(workflowResponse.error).toBe(null);
    expect(workflowResponse.data.name).toBe(sampleData.name);
    expect(workflowResponse.data.description).toBe(sampleData.description);
  });

  it('Invalid access token -> 401', async () => {
    const invalidToken = '6743274632842';
    const workflowResponse = await api.post(`${endpoint}/workflows`, invalidToken, {}, 401);
    expect(workflowResponse.error.message).toBe('Unauthorized');
  });

  it('Invalid parameters -> 405', async () => {
    const workflowResponse = await api.post(`${endpoint}/workflows`, ACCESS_TOKEN, {}, 405);
    expect(workflowResponse.error.message).toBe('Request method \'POST\' not supported'); // <- Incorrect error on your side
  });
});
