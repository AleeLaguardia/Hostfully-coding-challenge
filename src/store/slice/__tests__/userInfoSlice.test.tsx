import { configureStore, Store } from '@reduxjs/toolkit';
import userReducer, { setUser, updateUser } from '../userInfoSlice';

describe('userSlice reducers', () => {
  let store: Store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  it('should handle setUser', () => {
    const userData = {
      destination: 'New York',
      adults: '2',
      children: '1',
      date: new Date(),
    };

    store.dispatch(setUser(userData));
    const state = store.getState().user;
    expect(state).toEqual(userData);
  });

  it('should handle updateUser', () => {
    const initialState = {
      destination: 'Paris',
      adults: '1',
      children: '0',
      date: new Date(),
    };

    const updatedData = {
      adults: '2',
      children: '1',
    };

    store.dispatch(setUser(initialState));
    store.dispatch(updateUser(updatedData));

    const state = store.getState().user;
    const expectedState = {
      destination: 'Paris',
      adults: '2',
      children: '1',
      date: expect.any(Date),
    };
    expect(state).toEqual(expectedState);
  });
});
