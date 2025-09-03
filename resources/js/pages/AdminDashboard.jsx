// resources/js/pages/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    // State for teacher form
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    
    // State for student form
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [classes, setClasses] = useState([]);

    // State for messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch classes for the student registration dropdown
    useEffect(() => {
        apiClient.get('/classes')
            .then(response => setClasses(response.data))
            .catch(err => console.error("Failed to fetch classes", err));
    }, []);

    const handleRegisterTeacher = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        apiClient.post('/admin/register-teacher', {
            name: teacherName,
            email: teacherEmail,
            password: teacherPassword
        }).then(response => {
            setMessage(response.data.message);
            // Clear form
            setTeacherName('');
            setTeacherEmail('');
            setTeacherPassword('');
        }).catch(err => {
            setError('Failed to register teacher. Please check the details.');
            console.error(err);
        });
    };

    const handleRegisterStudent = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        apiClient.post('/admin/register-student', {
            name: studentName,
            school_class_id: studentClass
        }).then(response => {
            setMessage(response.data.message);
            // Clear form
            setStudentName('');
            setStudentClass('');
        }).catch(err => {
            setError('Failed to register student. Please check the details.');
            console.error(err);
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <p>Welcome, {user?.name}!</p>
            <hr />

            <div style={{ display: 'flex', gap: '50px' }}>
                {/* Teacher Registration Form */}
                <div style={{ flex: 1 }}>
                    <h2>Register New Teacher</h2>
                    <form onSubmit={handleRegisterTeacher}>
                        <div>
                            <label>Name:</label><br/>
                            <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} required />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>Email:</label><br/>
                            <input type="email" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} required />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>Password:</label><br/>
                            <input type="password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} required />
                        </div>
                        <button type="submit" style={{ marginTop: '15px' }}>Register Teacher</button>
                    </form>
                </div>

                {/* Student Registration Form */}
                <div style={{ flex: 1 }}>
                    <h2>Register New Student</h2>
                    <form onSubmit={handleRegisterStudent}>
                        <div>
                            <label>Name:</label><br/>
                            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>Class:</label><br/>
                            <select value={studentClass} onChange={e => setStudentClass(e.target.value)} required>
                                <option value="">-- Select a Class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <button type="submit" style={{ marginTop: '15px' }}>Register Student</button>
                    </form>
                </div>
            </div>
            {message && <p style={{ color: 'green', marginTop: '20px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
        </div>
    );
}