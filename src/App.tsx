import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navigation from './navigation';
import { restoreSession } from './store/slice/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div data-testid="root">
      <Navigation />
    </div>
  )
}

export default App;
