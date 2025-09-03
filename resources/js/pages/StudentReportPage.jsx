// resources/js/pages/StudentReportPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';

export default function StudentReportPage() {
    const { studentId } = useParams(); // Gets the studentId from the URL
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get(`/reports/student/${studentId}`)
            .then(response => {
                setReportData(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load report data.');
            })
            .finally(() => setLoading(false));
    }, [studentId]);

    if (loading) return <p>Loading report...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!reportData) return <p>No data found.</p>;

    const { student, summary, records } = reportData;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Attendance Report for {student.name}</h1>
            <p><strong>Class:</strong> {student.school_class.name}</p>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
                <div><strong>Total Days:</strong> {summary.total_days}</div>
                <div><strong>Days Present:</strong> {summary.present_days}</div>
                <div><strong>Days Absent:</strong> {summary.absent_days}</div>
            </div>

            <h2>Attendance History</h2>
            <table style={{ borderCollapse: 'collapse', width: '400px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.attendance_date}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}