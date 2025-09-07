// resources/js/pages/ClassReportPage.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

export default function ClassReportPage() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch classes for the dropdown
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
    
    // Format the month (e.g., 2023-09) to a more readable format (September 2023)
    const formatMonth = (monthString) => {
        if (!monthString) return '';
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Class Attendance Report</h1>
                    <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Report Generation Form Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4">
                        {/* Class Selector */}
                        <div>
                            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                            <select id="class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Choose a Class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Month Selector */}
                        <div>
                            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                            <input id="month-select" type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="self-end">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition" disabled={loading}>
                                {loading ? 'Generating...' : 'Generate Report'}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Status Messages */}
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">{error}</div>}

                {/* Report Display Card */}
                {reportData && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Report for {reportData.class_name}</h2>
                            <p className="text-gray-600">{formatMonth(selectedMonth)}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Student Name</th>
                                        <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Present</th>
                                        <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Absent</th>
                                        <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Total School Days</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reportData.report.map(student => (
                                        <tr key={student.student_id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-800 font-medium">{student.student_name}</td>
                                            <td className="p-4 text-center text-green-600 font-semibold">{student.present_days}</td>
                                            <td className="p-4 text-center text-red-600 font-semibold">{student.absent_days}</td>
                                            <td className="p-4 text-center text-gray-500">{student.total_days}</td>
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