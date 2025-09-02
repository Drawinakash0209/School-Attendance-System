import { createRoot } from 'react-dom/client';
import './bootstrap';

function App() {
    return (
        <h1>School Attendance System</h1>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);