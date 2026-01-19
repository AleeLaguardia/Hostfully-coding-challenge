import axios, { AxiosResponse } from "axios";
import { User, LoginCredentials, RegisterData } from "../utils/types/authTypes";
import { Hotel } from "../utils/types/hotelTypes";

const api = axios.create({
  baseURL: 'http://localhost:3001/',
});

export const loginApi = async (credentials: LoginCredentials): Promise<{ user: User } | { error: string }> => {
  try {
    const response: AxiosResponse<any[]> = await api.get('users', {
      params: { email: credentials.email }
    });

    if (response.status === 200 && response.data.length > 0) {
      const user = response.data[0];
      if (user.password === credentials.password) {
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
      }
      return { error: 'Invalid password' };
    }
    return { error: 'User not found' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

export const registerApi = async (userData: RegisterData): Promise<{ user: User } | { error: string }> => {
  try {
    const existingUser = await api.get('users', {
      params: { email: userData.email }
    });

    if (existingUser.data.length > 0) {
      return { error: 'Email already registered' };
    }

    const response: AxiosResponse<any> = await api.post('users', userData);

    if (response.status === 201) {
      const { password, ...userWithoutPassword } = response.data;
      return { user: userWithoutPassword };
    }
    return { error: 'Registration failed' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

export type ReservationData = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  checkIn: string;
  checkOut: string;
  hotel: Hotel;
}

export type ReservationResponse = ReservationData & { id: string };

export const getUserReservations = async (userId: string): Promise<{ data: ReservationResponse[] } | { error: string }> => {
  try {
    const response: AxiosResponse<ReservationResponse[]> = await api.get('reservations', {
      params: { userId }
    });
    if (response.status === 200) {
      return { data: response.data };
    }
    return { error: 'Failed to fetch reservations' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

export const getAllReservations = async (): Promise<{ data: ReservationResponse[] } | { error: string }> => {
  try {
    const response: AxiosResponse<ReservationResponse[]> = await api.get('reservations');
    if (response.status === 200) {
      return { data: response.data };
    }
    return { error: 'Failed to fetch reservations' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

const datesOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string): boolean => {
  const start1 = new Date(checkIn1);
  const end1 = new Date(checkOut1);
  const start2 = new Date(checkIn2);
  const end2 = new Date(checkOut2);

  return start1 < end2 && start2 < end1;
};

const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const checkReservationConflict = async (
  hotelId: string,
  checkIn: string,
  checkOut: string
): Promise<{ hasConflict: boolean; message?: string }> => {
  try {
    const response: AxiosResponse<ReservationResponse[]> = await api.get('reservations');

    if (response.status === 200) {
      const conflictingReservation = response.data.find((res) => {
        const isSameHotel = res.hotel.HotelId === hotelId;
        const hasDateOverlap = datesOverlap(checkIn, checkOut, res.checkIn, res.checkOut);
        return isSameHotel && hasDateOverlap;
      });

      if (conflictingReservation) {
        const checkInFormatted = formatDateForDisplay(conflictingReservation.checkIn);
        const checkOutFormatted = formatDateForDisplay(conflictingReservation.checkOut);
        return {
          hasConflict: true,
          message: `This hotel is already booked from ${checkInFormatted} to ${checkOutFormatted}`,
        };
      }
    }

    return { hasConflict: false };
  } catch (e) {
    return { hasConflict: false };
  }
};

export const createReservation = async (reservation: ReservationData): Promise<{ data: ReservationResponse } | { error: string }> => {
  try {
    const conflictCheck = await checkReservationConflict(
      reservation.hotel.HotelId,
      reservation.checkIn,
      reservation.checkOut
    );

    if (conflictCheck.hasConflict) {
      return { error: conflictCheck.message || 'This hotel is already booked for the selected dates' };
    }

    const response: AxiosResponse<ReservationResponse> = await api.post('reservations', reservation);
    if (response.status === 201) {
      return { data: response.data };
    }
    return { error: 'Failed to create reservation' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

export const updateReservationApi = async (id: string, updates: Partial<ReservationData>): Promise<{ data: ReservationResponse } | { error: string }> => {
  try {
    const response: AxiosResponse<ReservationResponse> = await api.patch(`reservations/${id}`, updates);
    if (response.status === 200) {
      return { data: response.data };
    }
    return { error: 'Failed to update reservation' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};

export const deleteReservationApi = async (id: string): Promise<{ success: boolean } | { error: string }> => {
  try {
    const response = await api.delete(`reservations/${id}`);
    if (response.status === 200) {
      return { success: true };
    }
    return { error: 'Failed to delete reservation' };
  } catch (e) {
    return { error: 'Something went wrong' };
  }
};
