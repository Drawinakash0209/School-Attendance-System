import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../services/api.js';

// --- ICONS ---
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const MagnifyingGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

// --- REUSABLE COMPONENTS ---
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className="bg-indigo-50 text-indigo-500 rounded-full p-3">
            {icon}
        </div>
    </div>
);

const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-4">{title}</h3>
        {children}
    </div>
);

// --- UPDATED FormInput component to merge classNames ---
const FormInput = ({ className = '', ...props }) => (
    <input 
        {...props} 
        className={`w-full p-3 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${className}`}
    />
);

const FormSelect = ({ children, ...props }) => (
    <select {...props} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none">
        {children}
    </select>
);

export default function AdminDashboard() {
    // --- State and logic remains the same ---
    const { user, logout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isTeacherEdit, setIsTeacherEdit] = useState(false);
    const [stats, setStats] = useState({ total_students: 0, total_teachers: 0, attendance_rate_today: 0 });
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teacherSearch, setTeacherSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get('/admin/stats').then(res => setStats(res.data));
        apiClient.get('/admin/teachers').then(res => setTeachers(res.data));
        apiClient.get('/admin/students').then(res => setStudents(res.data));
        apiClient.get('/classes').then(res => setClasses(res.data));
    }, []);

    const filteredTeachers = useMemo(() => teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.email.toLowerCase().includes(teacherSearch.toLowerCase())), [teachers, teacherSearch]);
    const filteredStudents = useMemo(() => students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())), [students, studentSearch]);
    
    const openEditModal = (userToEdit, isTeacher) => {
        setEditingUser(userToEdit);
        setIsTeacherEdit(isTeacher);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setEditingUser(null);
        setIsEditModalOpen(false);
    };
    const handleRegisterTeacher = (e) => { e.preventDefault(); apiClient.post('/admin/register-teacher', { name: teacherName, email: teacherEmail, password: teacherPassword }).then(res => { setMessage('Teacher registered successfully!'); apiClient.get('/admin/teachers').then(res => setTeachers(res.data)); setTeacherName(''); setTeacherEmail(''); setTeacherPassword(''); }).catch(err => setError('Failed to register teacher. Email may already exist.')); };
    const handleRegisterStudent = (e) => { e.preventDefault(); apiClient.post('/admin/register-student', { name: studentName, school_class_id: studentClass }).then(res => { setMessage('Student registered successfully!'); apiClient.get('/admin/students').then(res => setStudents(res.data)); setStudentName(''); setStudentClass(''); }).catch(err => setError('Failed to register student.')); };
    const handleUpdate = (e) => { e.preventDefault(); const endpoint = isTeacherEdit ? `/admin/teachers/${editingUser.id}` : `/admin/students/${editingUser.id}`; const payload = isTeacherEdit ? { name: editingUser.name, email: editingUser.email } : { name: editingUser.name, school_class_id: editingUser.school_class_id }; apiClient.put(endpoint, payload).then(res => { setMessage(res.data.message); if (isTeacherEdit) { setTeachers(teachers.map(t => t.id === editingUser.id ? res.data.teacher : t)); } else { setStudents(students.map(s => s.id === editingUser.id ? res.data.student : s)); } closeEditModal(); }).catch(() => setError('Failed to update user.')); };
    const handleDelete = (id, isTeacher) => { if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) { const endpoint = isTeacher ? `/admin/teachers/${id}` : `/admin/students/${id}`; apiClient.delete(endpoint).then(res => { setMessage(res.data.message); if (isTeacher) { setTeachers(teachers.filter(t => t.id !== id)); } else { setStudents(students.filter(s => s.id !== id)); } }).catch(() => setError('Failed to delete user.')); } };
    
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <header className="bg-white/80 backdrop-blur-md p-4 border-b border-slate-200/80 flex justify-between items-center sticky top-0 z-20">
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <div className='flex items-center gap-4'>
                    <span className="text-sm font-medium text-slate-600 hidden sm:block">Welcome, {user?.name}!</span>
                    <a href="/reports/class" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Class Reports</a>
                    <button onClick={logout} className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm">Logout</button>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Students" value={stats.total_students} icon={<UserGroupIcon />} />
                    <StatCard title="Total Teachers" value={stats.total_teachers} icon={<UserIcon />} />
                    <StatCard title="Today's Attendance" value={`${stats.attendance_rate_today}%`} icon={<CheckCircleIcon />} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Manage Teachers</h3>
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon />
                            </div>
                            {/* UPDATED placeholder text */}
                            <FormInput type="text" placeholder="Search teachers by name or email..." value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} className="pl-10" />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            <ul className='divide-y divide-slate-200/80'>
                                {filteredTeachers.map(teacher => (
                                    <li key={teacher.id} className="py-3 px-1 hover:bg-slate-50 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-800">{teacher.name}</p>
                                            <p className='text-slate-500 text-sm'>{teacher.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(teacher, true)} className="p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors" title="Edit Teacher"><PencilIcon/></button>
                                            <button onClick={() => handleDelete(teacher.id, true)} className="p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors" title="Delete Teacher"><TrashIcon/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Manage Students</h3>
                        <div className="relative mb-4">
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon />
                            </div>
                            {/* UPDATED placeholder text */}
                            <FormInput type="text" placeholder="Search students by name..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="pl-10" />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                           <ul className='divide-y divide-slate-200/80'>
                                {filteredStudents.map(student => (
                                    <li key={student.id} className="py-3 px-1 hover:bg-slate-50 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-800">{student.name}</p>
                                            <p className='text-slate-500 text-sm'>{student.school_class.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(student, false)} className="p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors" title="Edit Student"><PencilIcon/></button>
                                            <button onClick={() => handleDelete(student.id, false)} className="p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors" title="Delete Student"><TrashIcon/></button>
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
                            <FormInput type="text" placeholder="Full Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} required />
                            <FormInput type="email" placeholder="Email Address" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} required />
                            <FormInput type="password" placeholder="Password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} required />
                            <button type="submit" className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm font-semibold">Register Teacher</button>
                        </form>
                    </FormSection>
                    <FormSection title="Register New Student">
                        <form onSubmit={handleRegisterStudent} className="space-y-4">
                            <FormInput type="text" placeholder="Full Name" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                            <FormSelect value={studentClass} onChange={e => setStudentClass(e.target.value)} required>
                                <option value="">-- Select a Class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </FormSelect>
                            <button type="submit" className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm font-semibold">Register Student</button>
                        </form>
                    </FormSection>
                </section>

                <div className="mt-6 space-y-4">
                  {message && <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">{message}</div>}
                  {error && <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-medium">{error}</div>}
                </div>
            </main>

            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title={`Edit ${isTeacherEdit ? 'Teacher' : 'Student'} Details`}>
                {editingUser && (
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <FormInput type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required />
                        </div>
                        {isTeacherEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <FormInput type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                                <FormSelect value={editingUser.school_class_id} onChange={e => setEditingUser({...editingUser, school_class_id: e.target.value})} required>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </FormSelect>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-semibold text-sm transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold text-sm transition-colors shadow-sm">Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}

