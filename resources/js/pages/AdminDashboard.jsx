import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal'; // <-- Import the Modal component
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

// SVG Icon Components
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// Reusable component for the statistics cards
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition hover:shadow-xl hover:-translate-y-1">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
    </div>
);

// Reusable component for form sections
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">{title}</h3>
        {children}
    </div>
);

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    // --- State for Modals and Editing ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Can be a teacher or student
    const [isTeacherEdit, setIsTeacherEdit] = useState(false);

    // State for all data
    const [stats, setStats] = useState({ total_students: 0, total_teachers: 0, attendance_rate_today: 0 });
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    
    // State for search filters
    const [teacherSearch, setTeacherSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');

    // State for forms
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    
    // State for messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch all necessary data on component mount
    useEffect(() => {
        apiClient.get('/admin/stats').then(res => setStats(res.data));
        apiClient.get('/admin/teachers').then(res => setTeachers(res.data));
        apiClient.get('/admin/students').then(res => setStudents(res.data));
        apiClient.get('/classes').then(res => setClasses(res.data));
    }, []);

    // Memoized filtering for performance
    const filteredTeachers = useMemo(() => 
        teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.email.toLowerCase().includes(teacherSearch.toLowerCase())),
        [teachers, teacherSearch]
    );

    const filteredStudents = useMemo(() =>
        students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())),
        [students, studentSearch]
    );
    
    // --- Handlers for Opening/Closing Modals ---
    const openEditModal = (userToEdit, isTeacher) => {
        setEditingUser(userToEdit);
        setIsTeacherEdit(isTeacher);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingUser(null);
        setIsEditModalOpen(false);
    };

    // --- Handlers for API Actions (Create, Update, Delete) ---
    const handleRegisterTeacher = (e) => { e.preventDefault(); apiClient.post('/admin/register-teacher', { name: teacherName, email: teacherEmail, password: teacherPassword }).then(res => { setMessage('Teacher registered successfully!'); apiClient.get('/admin/teachers').then(res => setTeachers(res.data)); setTeacherName(''); setTeacherEmail(''); setTeacherPassword(''); }).catch(err => setError('Failed to register teacher. Email may already exist.')); };
    const handleRegisterStudent = (e) => { e.preventDefault(); apiClient.post('/admin/register-student', { name: studentName, school_class_id: studentClass }).then(res => { setMessage('Student registered successfully!'); apiClient.get('/admin/students').then(res => setStudents(res.data)); setStudentName(''); setStudentClass(''); }).catch(err => setError('Failed to register student.')); };

    const handleUpdate = (e) => {
        e.preventDefault();
        const endpoint = isTeacherEdit ? `/admin/teachers/${editingUser.id}` : `/admin/students/${editingUser.id}`;
        const payload = isTeacherEdit 
            ? { name: editingUser.name, email: editingUser.email }
            : { name: editingUser.name, school_class_id: editingUser.school_class_id };

        apiClient.put(endpoint, payload).then(res => {
            setMessage(res.data.message);
            if (isTeacherEdit) {
                setTeachers(teachers.map(t => t.id === editingUser.id ? res.data.teacher : t));
            } else {
                setStudents(students.map(s => s.id === editingUser.id ? res.data.student : s));
            }
            closeEditModal();
        }).catch(() => setError('Failed to update user.'));
    };

    const handleDelete = (id, isTeacher) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const endpoint = isTeacher ? `/admin/teachers/${id}` : `/admin/students/${id}`;
            apiClient.delete(endpoint).then(res => {
                setMessage(res.data.message);
                if (isTeacher) {
                    setTeachers(teachers.filter(t => t.id !== id));
                } else {
                    setStudents(students.filter(s => s.id !== id));
                }
            }).catch(() => setError('Failed to delete user.'));
        }
    };
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className='flex items-center'>
                    <span className="mr-4 text-gray-600">Welcome, {user?.name}!</span>
                    <a href="/reports/class" className="text-indigo-600 hover:underline mr-4 font-medium">Class Reports</a>
                    <button onClick={logout} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">Logout</button>
                </div>
            </header>

            <main className="p-8">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Students" value={stats.total_students} icon={<UserGroupIcon />} />
                    <StatCard title="Total Teachers" value={stats.total_teachers} icon={<UserIcon />} />
                    <StatCard title="Today's Attendance" value={`${stats.attendance_rate_today}%`} icon={<CheckCircleIcon />} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Teachers</h3>
                        <input type="text" placeholder="Search teachers..." value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"/>
                        <div className="max-h-64 overflow-y-auto">
                            <ul className='divide-y divide-gray-200'>
                                {filteredTeachers.map(teacher => (
                                    <li key={teacher.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <p>{teacher.name}</p>
                                            <p className='text-gray-500 text-sm'>{teacher.email}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => openEditModal(teacher, true)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(teacher.id, true)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Students</h3>
                        <input type="text" placeholder="Search students..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"/>
                        <div className="max-h-64 overflow-y-auto">
                           <ul className='divide-y divide-gray-200'>
                                {filteredStudents.map(student => (
                                    <li key={student.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <p>{student.name}</p>
                                            <p className='text-gray-500 text-sm'>{student.school_class.name}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => openEditModal(student, false)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(student.id, false)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormSection title="Register New Teacher">
                        <form onSubmit={handleRegisterTeacher} className="space-y-4">
                            <input type="text" placeholder="Full Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <input type="email" placeholder="Email Address" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <input type="password" placeholder="Password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold">Register Teacher</button>
                        </form>
                    </FormSection>
                    <FormSection title="Register New Student">
                        <form onSubmit={handleRegisterStudent} className="space-y-4">
                            <input type="text" placeholder="Full Name" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                                <option value="">-- Select a Class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold">Register Student</button>
                        </form>
                    </FormSection>
                </section>

                {message && <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg">{message}</div>}
                {error && <div className="mt-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg">{error}</div>}
            </main>

            {/* --- Render the Edit Modal --- */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title={`Edit ${isTeacherEdit ? 'Teacher' : 'Student'}`}>
                {editingUser && (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input 
                                type="text" 
                                value={editingUser.name} 
                                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {isTeacherEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Class</label>
                                <select 
                                    value={editingUser.school_class_id} 
                                    onChange={e => setEditingUser({...editingUser, school_class_id: e.target.value})}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}

