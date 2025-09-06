// resources/js/pages/StudentReportPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';

export default function StudentReportPage() {
    const { studentId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- NEW: State for date pickers ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- UPDATED: useEffect hook to handle date filtering ---
    useEffect(() => {
        setLoading(true);
        setError('');
        
        // Prepare query parameters to send to the API
        const params = {};
        if (startDate && endDate) {
            params.start_date = startDate;
            params.end_date = endDate;
        }

        // The API call now includes the date params if they exist
        apiClient.get(`/reports/student/${studentId}`, { params })
            .then(response => {
                setReportData(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load report data.');
            })
            .finally(() => setLoading(false));
    }, [studentId, startDate, endDate]); // The effect re-runs whenever the studentId or dates change

    if (loading) return <p>Loading report...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!reportData) return <p>No data found.</p>;

    const { student, summary, records } = reportData;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Attendance Report for {student.name}</h1>
            <p><strong>Class:</strong> {student.school_class.name}</p>

            {/* --- NEW: Date filter UI --- */}
            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <strong>Filter by Date Range:</strong>
                <div>
                    <label>Start Date: </label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label>End Date: </label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
                <div><strong>Total Days in Range:</strong> {summary.total_days}</div>
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