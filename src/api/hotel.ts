import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: 'https://run.mocky.io/v3/',
});

// In order to make this work, you need to access https://designer.mocky.io/design
// Open the file text.json, copy everything that is in there and paste in the HTTP Response Body box
// Once that is done, click on GENERATE MY HTTP RESPONSE
// There will be a link generated like this: https://run.mocky.io/v3/ff652d7a-9460-41a2-9202-ace4bae106c2/
// Take the last part of this endpoint and change it in this variable below:

const endpoint = 'ffbbb2d7-77e0-43db-b149-bb61bc894b71/';

export const getHotels = async () => {
  try {
    const response: AxiosResponse<any, any> = await api.get(endpoint);

    if (response.status === 200) {
      return response;
    }
    throw new Error('Something went wrong');
  } catch (e) {
    return { message: 'Something went wrong' };
  };
};
