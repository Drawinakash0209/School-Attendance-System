import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

// --- NEW & REFINED ICONS ---
// Using a consistent icon style enhances the UI.
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;


export default function TeacherDashboard() {
    // --- NO CHANGES TO STATE OR LOGIC ---
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
            setAttendance({}); // Reset attendance when class changes
            apiClient.get(`/attendance/class/${selectedClass}`)
                .then(response => {
                    const studentsData = response.data;
                    setStudents(studentsData);
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

    // --- UI & STYLING CHANGES BELOW ---
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <header className="bg-white/80 backdrop-blur-md p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-slate-800">Teacher Dashboard</h1>
                <div className='flex items-center gap-4'>
                    <div className="flex items-center gap-2 text-slate-600">
                        <UserCircleIcon />
                        <span className="text-sm font-medium">Welcome, {user?.name}!</span>
                    </div>
                    <button onClick={logout} className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors duration-300 shadow-sm">Logout</button>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Mark Daily Attendance</h2>
                    <div className="flex items-center gap-4">
                        <label htmlFor="class-select" className="font-medium text-slate-700 sr-only">Select Class:</label>
                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <BookOpenIcon />
                            </div>
                            <select 
                                id="class-select"
                                value={selectedClass} 
                                onChange={(e) => setSelectedClass(e.target.value)} 
                                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-shadow"
                            >
                                <option value="">-- Choose a Class --</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {loading && (
                    <div className="flex justify-center items-center p-12">
                        <SpinnerIcon />
                    </div>
                )}
                
                {!loading && selectedClass && students.length === 0 && !error && (
                    <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500">No students found for this class.</p>
                    </div>
                )}

                {!loading && students.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-3 text-center font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-center font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {students.map(student => (
                                            <tr key={student.id} className="hover:bg-slate-50/75 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{student.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleAttendanceChange(student.id, 'Present')}
                                                            className={`flex items-center justify-center gap-1.5 w-28 py-2 rounded-full font-semibold transition-all duration-200 text-xs ${attendance[student.id] === 'Present' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-300'}`}
                                                        >
                                                            <CheckIcon /> Present
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleAttendanceChange(student.id, 'Absent')}
                                                            className={`flex items-center justify-center gap-1.5 w-28 py-2 rounded-full font-semibold transition-all duration-200 text-xs ${attendance[student.id] === 'Absent' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-300'}`}
                                                        >
                                                            <XIcon /> Absent
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link to={`/reports/student/${student.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline" target="_blank">View Report</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 bg-slate-50/75 border-t border-slate-200 flex justify-end">
                                <button 
                                    type="submit" 
                                    className="bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={!isAllMarked}
                                >
                                    {message ? 'Update Attendance' : 'Submit Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="mt-6 space-y-4">
                    {message && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                            <SuccessIcon />
                            <span className="font-medium">{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg">
                            <ErrorIcon />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}