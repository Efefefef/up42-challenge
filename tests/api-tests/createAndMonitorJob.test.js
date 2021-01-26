import api from '../helpers/api';
import { HOST, PROJECT_ID, PROJECT_API_KEY } from '../../config';
import { workflowDataSample, taskTaskSample, jobDataSample, invalidToken } from '../testData';

const baseUrl = `https://${HOST}`;
const endpoint = `${baseUrl}/projects/${PROJECT_ID}/workflows`;
const jobRunningTimeout = 60000;

describe('Create and monitor jobs', () => {
  let ACCESS_TOKEN;
  let workflowId;

  const waitForJobSuccess = async jobId => {
    const checkInterval = 1000;
    const getJobStatus = async jobId => await api.get(`${baseUrl}/projects/${PROJECT_ID}/jobs/${jobId}`, ACCESS_TOKEN);
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        const jobResult = await getJobStatus(jobId);
        const { data: { status } } = jobResult;
        if (status === 'SUCCEEDED' ) {
          clearInterval(interval);
          resolve(jobResult);
        }
      }, checkInterval)
    });
  };

  beforeAll(async () => {
    ACCESS_TOKEN = await api.getAccessToken({ HOST, PROJECT_ID, PROJECT_API_KEY });
    const workflowResponse = await api.post(endpoint, ACCESS_TOKEN, workflowDataSample);
    workflowId = workflowResponse.data.id;
    await api.post(`${endpoint}/${workflowId}/tasks`, ACCESS_TOKEN, taskTaskSample);
  });

  afterAll(async () => {
    await api.delete(`${endpoint}/${workflowId}`, ACCESS_TOKEN, 204);
  })

  it('Correct data -> ok', async () => {
    jest.setTimeout(jobRunningTimeout)
    const response = await api.post(`${endpoint}/${workflowId}/jobs`, ACCESS_TOKEN, jobDataSample);
    const jobId = response.data.id;
    expect(response.error).toBe(null);
    expect(response.data.status).toBe('NOT_STARTED');
    const jobResult = await waitForJobSuccess(jobId);
    expect(jobResult.data.status).toBe('SUCCEEDED');
  });

  it('Invalid access token -> 401', async () => {
    const response = await api.post(`${endpoint}/${workflowId}/jobs`, invalidToken, jobDataSample, 401);
    expect(response.error.message).toBe('Unauthorized');
  });

  it('Missing data -> 400', async () => {
    const response = await api.post(`${endpoint}/${workflowId}/jobs`, ACCESS_TOKEN, {}, 400);
    expect(response.error.message).toContain('There were missing tasks/queries');
  });
});
