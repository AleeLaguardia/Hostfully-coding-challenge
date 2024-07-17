// __mocks__/axios.ts

import { AxiosResponse } from 'axios';

const mockAxios = {
  get: jest.fn().mockResolvedValue({
    data: { value: [] }
  } as AxiosResponse<any>)
};

export default mockAxios;
