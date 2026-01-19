import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3001/',
});

export const getHotels = async () => {
  try {
    const response: AxiosResponse<any, any> = await api.get('hotels');

    if (response.status === 200) {
      return { ...response, data: { value: response.data } };
    }
    throw new Error('Something went wrong');
  } catch (e) {
    return { message: 'Something went wrong' };
  };
};
