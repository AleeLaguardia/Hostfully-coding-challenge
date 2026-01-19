jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    create: jest.fn(() => mockInstance),
    __mockInstance: mockInstance,
  };
});

import axios from 'axios';
import {
  loginApi,
  registerApi,
  getUserReservations,
  getAllReservations,
  checkReservationConflict,
  createReservation,
  updateReservationApi,
  deleteReservationApi,
  ReservationData,
} from '../auth';

const mockAxiosInstance = (axios as any).__mockInstance;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginApi', () => {
    it('returns user data on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [mockUser],
      });

      const result = await loginApi({ email: 'test@example.com', password: 'password123' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('users', {
        params: { email: 'test@example.com' },
      });
      expect(result).toEqual({
        user: { id: '1', email: 'test@example.com', name: 'John Doe' },
      });
    });

    it('returns error when password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'correctpassword',
        name: 'John Doe',
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [mockUser],
      });

      const result = await loginApi({ email: 'test@example.com', password: 'wrongpassword' });

      expect(result).toEqual({ error: 'Invalid password' });
    });

    it('returns error when user is not found', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [],
      });

      const result = await loginApi({ email: 'nonexistent@example.com', password: 'password' });

      expect(result).toEqual({ error: 'User not found' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await loginApi({ email: 'test@example.com', password: 'password' });

      expect(result).toEqual({ error: 'Something went wrong' });
    });

    it('returns error when status is not 200', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 500,
        data: [],
      });

      const result = await loginApi({ email: 'test@example.com', password: 'password' });

      expect(result).toEqual({ error: 'User not found' });
    });
  });

  describe('registerApi', () => {
    const userData = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    };

    it('returns user data on successful registration', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 200, data: [] });
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        data: { id: '2', ...userData },
      });

      const result = await registerApi(userData);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('users', {
        params: { email: 'new@example.com' },
      });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('users', userData);
      expect(result).toEqual({
        user: { id: '2', email: 'new@example.com', name: 'New User' },
      });
    });

    it('returns error when email is already registered', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [{ id: '1', email: 'new@example.com' }],
      });

      const result = await registerApi(userData);

      expect(result).toEqual({ error: 'Email already registered' });
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('returns error when registration fails', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 200, data: [] });
      mockAxiosInstance.post.mockResolvedValueOnce({ status: 400, data: {} });

      const result = await registerApi(userData);

      expect(result).toEqual({ error: 'Registration failed' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await registerApi(userData);

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('getUserReservations', () => {
    it('returns reservations for user', async () => {
      const mockReservations = [
        { id: '1', userId: 'user1', name: 'John Doe' },
        { id: '2', userId: 'user1', name: 'Jane Doe' },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockReservations,
      });

      const result = await getUserReservations('user1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('reservations', {
        params: { userId: 'user1' },
      });
      expect(result).toEqual({ data: mockReservations });
    });

    it('returns error when status is not 200', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 500, data: [] });

      const result = await getUserReservations('user1');

      expect(result).toEqual({ error: 'Failed to fetch reservations' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await getUserReservations('user1');

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('getAllReservations', () => {
    it('returns all reservations', async () => {
      const mockReservations = [
        { id: '1', userId: 'user1', name: 'John Doe' },
        { id: '2', userId: 'user2', name: 'Jane Doe' },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockReservations,
      });

      const result = await getAllReservations();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('reservations');
      expect(result).toEqual({ data: mockReservations });
    });

    it('returns error when status is not 200', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 500, data: [] });

      const result = await getAllReservations();

      expect(result).toEqual({ error: 'Failed to fetch reservations' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await getAllReservations();

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('checkReservationConflict', () => {
    const mockHotel = {
      HotelId: 'hotel1',
      HotelName: 'Test Hotel',
    };

    it('returns no conflict when no overlapping reservations exist', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: '1',
            hotel: mockHotel,
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
          },
        ],
      });

      const result = await checkReservationConflict('hotel1', '2024-01-10', '2024-01-15');

      expect(result).toEqual({ hasConflict: false });
    });

    it('returns conflict when dates overlap', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: '1',
            hotel: mockHotel,
            checkIn: '2024-01-05',
            checkOut: '2024-01-10',
          },
        ],
      });

      const result = await checkReservationConflict('hotel1', '2024-01-08', '2024-01-15');

      expect(result.hasConflict).toBe(true);
      expect(result.message).toContain('This hotel is already booked from');
    });

    it('returns no conflict for different hotel', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: '1',
            hotel: { HotelId: 'hotel2', HotelName: 'Other Hotel' },
            checkIn: '2024-01-05',
            checkOut: '2024-01-10',
          },
        ],
      });

      const result = await checkReservationConflict('hotel1', '2024-01-05', '2024-01-10');

      expect(result).toEqual({ hasConflict: false });
    });

    it('returns no conflict when API fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await checkReservationConflict('hotel1', '2024-01-01', '2024-01-05');

      expect(result).toEqual({ hasConflict: false });
    });

    it('returns no conflict when dates are adjacent but not overlapping', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: '1',
            hotel: mockHotel,
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
          },
        ],
      });

      const result = await checkReservationConflict('hotel1', '2024-01-05', '2024-01-10');

      expect(result).toEqual({ hasConflict: false });
    });
  });

  describe('createReservation', () => {
    const mockHotel = {
      HotelId: 'hotel1',
      HotelName: 'Test Hotel',
      Description: 'Test description',
      ImageSource: 'https://example.com/image.jpg',
      Address: {
        StreetAddress: '123 Test St',
        City: 'Test City',
        StateProvince: 'TS',
        Country: 'USA',
        PostalCode: '12345',
      },
      Category: 'Test',
      Location: { coordinates: [0, 0], type: 'Point' },
      Description_fr: 'Description test',
      LastRenovationDate: '2020-01-01',
      ParkingIncluded: true,
      Rating: 4.5,
      Tags: [],
      Rooms: [{ BaseRate: 100 }],
    };

    const reservationData: ReservationData = {
      userId: 'user1',
      name: 'John Doe',
      phone: '(555) 555-5555',
      email: 'john@example.com',
      paymentMethod: 'Credit Card',
      checkIn: '2024-02-01',
      checkOut: '2024-02-05',
      hotel: mockHotel as any,
    };

    it('creates reservation successfully', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 200, data: [] });
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        data: { id: '1', ...reservationData },
      });

      const result = await createReservation(reservationData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('reservations', reservationData);
      expect(result).toEqual({ data: { id: '1', ...reservationData } });
    });

    it('returns error when there is a conflict', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: '1',
            hotel: mockHotel,
            checkIn: '2024-02-01',
            checkOut: '2024-02-05',
          },
        ],
      });

      const result = await createReservation(reservationData);

      expect(result).toHaveProperty('error');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('returns error when creation fails', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 200, data: [] });
      mockAxiosInstance.post.mockResolvedValueOnce({ status: 400, data: {} });

      const result = await createReservation(reservationData);

      expect(result).toEqual({ error: 'Failed to create reservation' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ status: 200, data: [] });
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('Network error'));

      const result = await createReservation(reservationData);

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('updateReservationApi', () => {
    it('updates reservation successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedReservation = { id: '1', name: 'Updated Name', userId: 'user1' };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        data: updatedReservation,
      });

      const result = await updateReservationApi('1', updates);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('reservations/1', updates);
      expect(result).toEqual({ data: updatedReservation });
    });

    it('returns error when update fails', async () => {
      mockAxiosInstance.patch.mockResolvedValueOnce({ status: 400, data: {} });

      const result = await updateReservationApi('1', { name: 'Updated' });

      expect(result).toEqual({ error: 'Failed to update reservation' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.patch.mockRejectedValueOnce(new Error('Network error'));

      const result = await updateReservationApi('1', { name: 'Updated' });

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('deleteReservationApi', () => {
    it('deletes reservation successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ status: 200 });

      const result = await deleteReservationApi('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('reservations/1');
      expect(result).toEqual({ success: true });
    });

    it('returns error when deletion fails', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ status: 400 });

      const result = await deleteReservationApi('1');

      expect(result).toEqual({ error: 'Failed to delete reservation' });
    });

    it('returns error when API call fails', async () => {
      mockAxiosInstance.delete.mockRejectedValueOnce(new Error('Network error'));

      const result = await deleteReservationApi('1');

      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });
});
