import React, {useEffect, useState} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './store';
import Routes from './Routes';
import LoginProvider from './context/LoginProvider';
const queryClient = new QueryClient()

const App = () => {

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 400);
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <LoginProvider>
        <Provider store={store}>
          {loading ? null : <Routes />}
        </Provider>
      </LoginProvider>
    </QueryClientProvider>
  );
};

export default App;
