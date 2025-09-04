import { createBrowserRouter } from 'react-router-dom'
import Login from '../Login/Login'
import App from '../../App'
import Dashboard from '../Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Login /> },
            { path: "/dashboard", element: <ProtectedRoute element={<Dashboard />} /> },
        ],
    },
]);