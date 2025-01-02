import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from '@/context/auth_context.tsx';
import store from '@/redux/store.ts';
import { NavigationProvider } from './context/navigation_context.tsx';
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        {/* <NavigationProvider> */}
        <App />
        {/* </NavigationProvider> */}
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);
