import api from '../helpers/api';
import { HOST, PROJECT_ID, PROJECT_API_KEY } from '../../config';

const baseUrl = `https://${HOST}`;
const endpoint = `${baseUrl}/projects/${PROJECT_ID}`;

describe('Challenge test suite', () => {

  it('Positive workflow', async () => {
    const ACCESS_TOKEN = await api.getAccessToken({ HOST, PROJECT_ID, PROJECT_API_KEY });
    const workflowResponse = await api.post(`${endpoint}/workflows`, ACCESS_TOKEN,
      {
        'name': 'QA coding challenge workflow',
        'description': 'Workflow description',
      }
    );
    // console.log(workflowResponse)
    const projectId = workflowResponse.data.id;
    const taskResponse = await api.post(`${endpoint}/workflows/${projectId}/tasks`, ACCESS_TOKEN,
      [
        {
          "name": "nasa-modis:1",
          "parentName": null,
          "blockId": "ef6faaf5-8182-4986-bce4-4f811d2745e5"
        },
        {
          "name": "sharpening:1",
          "parentName": "nasa-modis:1",
          "blockId": "e374ea64-dc3b-4500-bb4b-974260fb203e"
        }
      ]
    );
    // console.log(taskResponse)
    const job = await api.post(`${endpoint}/workflows/${projectId}/jobs`, ACCESS_TOKEN,
      {
        "nasa-modis:1":
          {
            "time": "2018-12-01T00:00:00+00:00/2020-12-31T23:59:59+00:00",
            "limit": 1,
            "zoom_level": 9,
            "imagery_layers": [
              "MODIS_Terra_CorrectedReflectance_TrueColor"
            ],
            "bbox": [
              13.365373,
              52.49582,
              13.385796,
              52.510455
            ]
          },
        "sharpening:1": {
          "strength": "medium"
        }
      }
    );
    // console.log(job)
    await api.delete(`${endpoint}/workflows/${projectId}`, ACCESS_TOKEN, 204);
  });

});

