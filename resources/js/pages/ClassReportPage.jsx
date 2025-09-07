import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

// --- ICONS ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CalendarDaysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;


// --- SKELETON LOADER COMPONENT ---
// Provides a better UX than a simple spinner by showing the shape of the upcoming content.
const SkeletonReportTable = () => (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
        <div className="p-6 border-b border-slate-200/80">
            <div className="h-7 bg-slate-200 rounded w-3/5 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        {Array(4).fill(0).map((_, i) => (
                            <th key={i} className="p-4"><div className="h-4 bg-slate-300 rounded w-full"></div></th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                    {Array(5).fill(0).map((_, i) => (
                        <tr key={i}>
                            <td className="p-4"><div className="h-5 bg-slate-200 rounded w-3/4"></div></td>
                            <td className="p-4"><div className="h-5 bg-slate-200 rounded mx-auto w-1/2"></div></td>
                            <td className="p-4"><div className="h-5 bg-slate-200 rounded mx-auto w-1/2"></div></td>
                            <td className="p-4"><div className="h-5 bg-slate-200 rounded mx-auto w-1/2"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


export default function ClassReportPage() {
    // --- NO CHANGES TO STATE OR LOGIC ---
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`); // Default to current month
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get('/classes')
            .then(response => setClasses(response.data))
            .catch(err => console.error("Failed to fetch classes", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedClass || !selectedMonth) {
            setError('Please select both a class and a month.');
            return;
        }
        setLoading(true);
        setError('');
        setReportData(null);

        apiClient.get(`/reports/class`, { params: { school_class_id: selectedClass, month: selectedMonth } })
            .then(response => {
                setReportData(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to generate report. Please check the data and try again.');
            })
            .finally(() => setLoading(false));
    };
    
    const formatMonth = (monthString) => {
        if (!monthString) return '';
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // --- UI & STYLING CHANGES BELOW ---
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Class Attendance Report</h1>
                    <Link to="/admin-dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                        <ArrowLeftIcon />
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm mb-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                        <div className="relative">
                            <label htmlFor="class-select" className="block text-sm font-medium text-slate-700 mb-1.5">Select Class</label>
                            <div className="absolute inset-y-0 left-0 top-7 flex items-center pl-3 pointer-events-none">
                                <BookOpenIcon />
                            </div>
                            <select id="class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none">
                                <option value="">-- Choose a Class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <label htmlFor="month-select" className="block text-sm font-medium text-slate-700 mb-1.5">Select Month</label>
                            <div className="absolute inset-y-0 left-0 top-7 flex items-center pl-3 pointer-events-none">
                                <CalendarDaysIcon />
                            </div>
                            <input id="month-select" type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
                        </div>
                        
                        <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed w-full lg:w-auto" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </form>
                </div>
                
                {error && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg">
                        <ErrorIcon />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                
                {loading && <SkeletonReportTable />}

                {reportData && (
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200/80">
                            <h2 className="text-2xl font-bold text-slate-800">Report for {reportData.class_name}</h2>
                            <p className="text-indigo-600 font-semibold">{formatMonth(selectedMonth)}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-slate-600 uppercase tracking-wider">Student Name</th>
                                        <th className="p-4 text-center font-semibold text-slate-600 uppercase tracking-wider">Present</th>
                                        <th className="p-4 text-center font-semibold text-slate-600 uppercase tracking-wider">Absent</th>
                                        <th className="p-4 text-center font-semibold text-slate-600 uppercase tracking-wider">Total School Days</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/80">
                                    {reportData.report.map(student => (
                                        <tr key={student.student_id} className="hover:bg-slate-50/75 transition-colors">
                                            <td className="p-4 text-slate-800 font-medium whitespace-nowrap">{student.student_name}</td>
                                            <td className="p-4 text-center text-emerald-600 font-semibold">{student.present_days}</td>
                                            <td className="p-4 text-center text-rose-600 font-semibold">{student.absent_days}</td>
                                            <td className="p-4 text-center text-slate-500">{student.total_days}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}