import { useEffect } from 'react';
import './App.css'
import { Outlet } from 'react-router-dom'
import { apiRequest } from './Services/API';

function App() {
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Try refreshing automatically
        const refreshed = await apiRequest("/refresh", { method: "POST" });
        if (refreshed.success && refreshed.data.access_token) {
          localStorage.setItem("token", refreshed.data.access_token);
        }
      }
    };
    checkToken();
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
