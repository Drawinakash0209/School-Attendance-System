// resources/js/pages/StudentReportPage.jsx

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../services/api';

export default function StudentReportPage() {
    const { studentId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        
        const params = {};
        if (startDate && endDate) {
            params.start_date = startDate;
            params.end_date = endDate;
        }

        apiClient.get(`/reports/student/${studentId}`, { params })
            .then(response => setReportData(response.data))
            .catch(err => {
                console.error(err);
                setError('Failed to load report data.');
            })
            .finally(() => setLoading(false));
    }, [studentId, startDate, endDate]);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading report...</div>;
    if (error) return <div className="text-center p-10 text-red-500 bg-red-50">{error}</div>;
    if (!reportData) return <div className="text-center p-10 text-gray-500">No data found for this student.</div>;

    const { student, summary, records } = reportData;

    // A reusable card for displaying summary stats
    const StatCard = ({ title, value, colorClass }) => (
        <div className={`p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center border-t-4 ${colorClass}`}>
            <div className="text-4xl font-bold text-gray-800">{value}</div>
            <div className="text-sm font-medium text-gray-500 mt-1">{title}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 block">&larr; Back to Dashboard</Link>
                    <h1 className="text-4xl font-bold text-gray-800">Attendance Report</h1>
                    <p className="text-xl text-gray-600">
                        <strong>Student:</strong> {student.name} | <strong>Class:</strong> {student.school_class.name}
                    </p>
                </div>

                {/* Date Filter Card */}
                <div className="mb-8 p-4 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-wrap items-center gap-4">
                    <strong className="text-gray-700">Filter by Date Range:</strong>
                    <div className="flex items-center gap-2">
                        <label htmlFor="start-date" className="text-sm">Start:</label>
                        <input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="end-date" className="text-sm">End:</label>
                        <input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md"/>
                    </div>
                </div>

                {/* Summary Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Days Tracked" value={summary.total_days} colorClass="border-blue-500" />
                    <StatCard title="Present" value={summary.present_days} colorClass="border-green-500" />
                    <StatCard title="Absent" value={summary.absent_days} colorClass="border-red-500" />
                </div>

                {/* Attendance History Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <h2 className="text-2xl font-semibold text-gray-700 p-6">Attendance History</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Date</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {records.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{record.attendance_date}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}