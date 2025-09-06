// resources/js/pages/ClassReportPage.jsx

import { useEffect, useState } from 'react';
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
                setError('Failed to generate report.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Class Attendance Report</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div>
                        <label>Select Class: </label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                            <option value="">-- Choose a Class --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Select Month: </label>
                        <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
                    </div>
                    <button type="submit">Generate Report</button>
                </div>
            </form>

            {loading && <p>Generating report...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reportData && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Report for {reportData.class_name} - {selectedMonth}</h2>
                    <table style={{ borderCollapse: 'collapse', width: '600px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Student Name</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Present</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Absent</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.report.map(student => (
                                <tr key={student.student_id}>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.student_name}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{student.present_days}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{student.absent_days}</td>
                                    <td style={{ border: '1-px solid #ccc', padding: '8px', textAlign: 'center' }}>{student.total_days}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}