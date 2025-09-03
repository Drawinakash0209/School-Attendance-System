// resources/js/pages/TeacherDashboard.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export default function TeacherDashboard() {
    const { user, logout } = useAuth();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [attendance, setAttendance] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch all available classes when the component mounts
    useEffect(() => {
        apiClient.get('/classes')
            .then(response => {
                setClasses(response.data);
            })
            .catch(err => console.error("Failed to fetch classes", err));
    }, []);

    // Fetch students whenever a new class is selected
    useEffect(() => {
        if (selectedClass) {
            setLoading(true);
            setMessage('');
            setError('');
            apiClient.get(`/classes/${selectedClass}/students`)
                .then(response => {
                    setStudents(response.data);
                    setAttendance({}); // Reset attendance state for the new list of students
                })
                .catch(err => {
                    console.error("Failed to fetch students", err);
                    setError('Could not load students for this class.');
                })
                .finally(() => setLoading(false));
        } else {
            setStudents([]); // Clear students if no class is selected
        }
    }, [selectedClass]);

    // Update the attendance state when a teacher marks a student
    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };
    
    // Handle the submission of the attendance form
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const attendanceData = Object.keys(attendance).map(studentId => ({
            student_id: parseInt(studentId), // Ensure student_id is an integer
            status: attendance[studentId],
        }));

        if (attendanceData.length === 0 || attendanceData.length !== students.length) {
            setError('Please mark attendance for all students.');
            return;
        }

        apiClient.post('/attendance', { attendances: attendanceData })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(err => {
                setError('Failed to submit attendance. You may have already marked it for today.');
                console.error(err);
            });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Teacher Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <p>Welcome, {user?.name}!</p>
            
            <hr />

            <h2>Mark Attendance</h2>
            
            <div>
                <label>Select Class: </label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                    <option value="">-- Choose a Class --</option>
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading students...</p>}
            
            {students.length > 0 && (
                <form onSubmit={handleSubmit}>
<table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '600px' }}>
    <thead>
        <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Student Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Status</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Actions</th>
        </tr>
    </thead>
    <tbody>
        {students.map(student => (
            <tr key={student.id}>
                {/* Column 1: Student Name */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.name}</td>
                
                {/* Column 2: Status Buttons (This was missing) */}
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        <input type="radio" name={`student_${student.id}`} onChange={() => handleAttendanceChange(student.id, 'Present')} required/> Present
                    </label>
                    <label>
                        <input type="radio" name={`student_${student.id}`} onChange={() => handleAttendanceChange(student.id, 'Absent')} /> Absent
                    </label>
                </td>

                {/* Column 3: Actions Link */}
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                    <a href={`/reports/student/${student.id}`} target="_blank" rel="noopener noreferrer">View Report</a>
                </td>
            </tr>
        ))}
    </tbody>
</table>
                    <button type="submit" style={{ marginTop: '10px', padding: '10px 15px' }}>Submit Attendance</button>
                </form>
            )}

            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}