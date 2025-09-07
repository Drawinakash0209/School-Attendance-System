import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

// SVG Icon Components
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


export default function TeacherDashboard() {
    const { user, logout } = useAuth();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [attendance, setAttendance] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiClient.get('/classes')
            .then(response => setClasses(response.data))
            .catch(err => console.error("Failed to fetch classes", err));
    }, []);

    useEffect(() => {
        if (selectedClass) {
            setLoading(true);
            setMessage('');
            setError('');
            // Use the NEW endpoint to get students with their current attendance status
            apiClient.get(`/attendance/class/${selectedClass}`)
                .then(response => {
                    const studentsData = response.data;
                    setStudents(studentsData);
                    
                    // Pre-populate the attendance state from the fetched data
                    const initialAttendance = studentsData.reduce((acc, student) => {
                        if (student.status) {
                            acc[student.id] = student.status;
                        }
                        return acc;
                    }, {});
                    setAttendance(initialAttendance);
                })
                .catch(err => {
                    console.error("Failed to fetch students", err);
                    setError('Could not load students for this class.');
                })
                .finally(() => setLoading(false));
        } else {
            setStudents([]);
        }
    }, [selectedClass]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const attendanceData = Object.keys(attendance).map(studentId => ({
            student_id: parseInt(studentId),
            status: attendance[studentId],
        }));

        if (students.length > 0 && attendanceData.length !== students.length) {
            setError('Please mark attendance for all students before submitting.');
            return;
        }

        apiClient.post('/attendance', { attendances: attendanceData })
            .then(response => setMessage(response.data.message))
            .catch(err => setError('Failed to submit attendance. Please try again.'));
    };

    const isAllMarked = students.length > 0 && Object.keys(attendance).length === students.length;

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
                <div className='flex items-center'>
                    <span className="mr-4 text-gray-600">Welcome, {user?.name}!</span>
                    <button onClick={logout} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">Logout</button>
                </div>
            </header>

            <main className="p-8">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Mark Daily Attendance</h2>
                    <div className="flex items-center gap-4">
                        <label htmlFor="class-select" className="font-medium text-gray-700">Select Class:</label>
                        <select 
                            id="class-select"
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)} 
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- Choose a Class --</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-600">Loading students...</p>}
                
                {!loading && students.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Student Name</th>
                                            <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
                                            <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {students.map(student => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="p-4 text-gray-800 font-medium">{student.name}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleAttendanceChange(student.id, 'Present')}
                                                            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition ${attendance[student.id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-200'}`}
                                                        >
                                                            <CheckIcon /> Present
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleAttendanceChange(student.id, 'Absent')}
                                                            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition ${attendance[student.id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-200'}`}
                                                        >
                                                            <XIcon /> Absent
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Link to={`/reports/student/${student.id}`} className="text-indigo-600 hover:underline font-medium" target="_blank">View Report</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={!isAllMarked}
                                >
                                    {message ? 'Update Attendance' : 'Submit Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {message && <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg">{message}</div>}
                {error && <div className="mt-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg">{error}</div>}

            </main>
        </div>
    );
}
