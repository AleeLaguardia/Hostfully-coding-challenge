jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
  };
  return {
    create: jest.fn(() => mockInstance),
    __mockInstance: mockInstance,
  };
});

import axios from 'axios';
import { getHotels } from '../hotel';

const mockAxiosInstance = (axios as any).__mockInstance;

describe('Hotel API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHotels', () => {
    it('returns hotels data on successful request', async () => {
      const mockHotels = [
        {
          HotelId: '1',
          HotelName: 'Hotel One',
          Description: 'A nice hotel',
          Address: {
            StreetAddress: '123 Main St',
            City: 'New York',
            StateProvince: 'NY',
            Country: 'USA',
            PostalCode: '10001',
          },
          Rating: 4.5,
        },
        {
          HotelId: '2',
          HotelName: 'Hotel Two',
          Description: 'Another nice hotel',
          Address: {
            StreetAddress: '456 Oak Ave',
            City: 'Los Angeles',
            StateProvince: 'CA',
            Country: 'USA',
            PostalCode: '90001',
          },
          Rating: 4.0,
        },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockHotels,
      });

      const result = await getHotels();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('hotels');
      expect(result).toEqual({
        status: 200,
        data: { value: mockHotels },
      });
    });

    it('returns hotels with value wrapper format', async () => {
      const mockHotels = [{ HotelId: '1', HotelName: 'Test Hotel' }];

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockHotels,
      });

      const result = await getHotels();

      expect(result).toHaveProperty('data.value');
      expect(result.data.value).toEqual(mockHotels);
    });

    it('returns error message when status is not 200', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 500,
        data: [],
      });

      const result = await getHotels();

      expect(result).toEqual({ message: 'Something went wrong' });
    });

    it('returns error message when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await getHotels();

      expect(result).toEqual({ message: 'Something went wrong' });
    });

    it('returns empty array when no hotels exist', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [],
      });

      const result = await getHotels();

      expect(result).toEqual({
        status: 200,
        data: { value: [] },
      });
    });

    it('preserves all response properties', async () => {
      const mockHotels = [{ HotelId: '1' }];

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockHotels,
        headers: { 'content-type': 'application/json' },
        config: {},
      });

      const result = await getHotels();

      expect(result.status).toBe(200);
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });

    it('handles large datasets', async () => {
      const mockHotels = Array.from({ length: 250 }, (_, i) => ({
        HotelId: String(i + 1),
        HotelName: `Hotel ${i + 1}`,
      }));

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockHotels,
      });

      const result = await getHotels();

      expect(result.data.value).toHaveLength(250);
      expect(result.data.value[0].HotelName).toBe('Hotel 1');
      expect(result.data.value[249].HotelName).toBe('Hotel 250');
    });

    it('handles hotels with complete data structure', async () => {
      const completeHotel = {
        HotelId: '1',
        HotelName: 'Complete Hotel',
        Description: 'A complete hotel with all fields',
        Description_fr: 'Un hôtel complet',
        ImageSource: 'https://example.com/image.jpg',
        Address: {
          StreetAddress: '123 Main St',
          City: 'New York',
          StateProvince: 'NY',
          Country: 'USA',
          PostalCode: '10001',
        },
        Category: 'Luxury',
        Location: {
          type: 'Point',
          coordinates: [-73.935242, 40.730610],
        },
        LastRenovationDate: '2023-01-01',
        ParkingIncluded: true,
        Rating: 5.0,
        Tags: ['pool', 'spa', 'gym'],
        Rooms: [
          { BaseRate: 200 },
          { BaseRate: 300 },
        ],
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [completeHotel],
      });

      const result = await getHotels();

      expect(result.data.value[0]).toEqual(completeHotel);
      expect(result.data.value[0].Rooms).toHaveLength(2);
      expect(result.data.value[0].Tags).toContain('pool');
    });
  });
});
