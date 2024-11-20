import './App.css';
import Router from '@/router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Router />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
