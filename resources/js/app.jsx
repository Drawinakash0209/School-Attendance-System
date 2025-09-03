// resources/js/app.jsx

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import StudentReportPage from './pages/StudentReportPage';
import TeacherDashboard from './pages/TeacherDashboard';
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

const AppRoutes = () => {
    const { user } = useAuth();

    // This component will decide which dashboard to show or redirect to login
    const DashboardRedirect = () => {
        if (!user) {
            return <Navigate to="/login" />;
        }
        if (user.role === 'admin') {
            return <AdminDashboard />;
        }
        if (user.role === 'teacher') {
            return <TeacherDashboard />;
        }
        return <Navigate to="/login" />; // Fallback
    };

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="/reports/student/:studentId" element={<StudentReportPage />} />
        </Routes>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);