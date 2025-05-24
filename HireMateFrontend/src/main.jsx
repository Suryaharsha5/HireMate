import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App.jsx'
import UserLoginStore from './context/userLoginstore.jsx';
import FreeLancerProfileStore from './context/freeLancerProfileStore.jsx';

createRoot(document.getElementById('root')).render(
  <FreeLancerProfileStore>
  <UserLoginStore>
    <App />
  </UserLoginStore>
  </FreeLancerProfileStore>
)
