import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- ICONS ---
// Simple logo and form field icons for a polished look.
const LogoIcon = () => (
    <svg className="h-8 w-auto text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v6.19L9.47 13.72a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06l-1.81 1.81V9z" clipRule="evenodd" />
    </svg>
);
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;


export default function LoginPage() {
    // --- NO CHANGES TO STATE OR LOGIC ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard'); // Or '/admin-dashboard' depending on role
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- UI & STYLING CHANGES BELOW ---
    return (
        <div className="min-h-screen bg-slate-100 font-sans grid lg:grid-cols-2">
            {/* Left Panel: Form */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <LogoIcon />
                        <h1 className="text-3xl font-bold text-slate-800 mt-4">Welcome Back</h1>
                        <p className="text-slate-500 mt-1">Sign in to your Attendance Management dashboard.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <label className="sr-only" htmlFor="email">Email</label>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <EmailIcon />
                            </div>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                placeholder="you@example.com" 
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="sr-only" htmlFor="password">Password</label>
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <LockIcon />
                            </div>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                placeholder="••••••••" 
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm">
                                <ErrorIcon />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                        
                        <button 
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </div>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Panel: Image */}
            <div className="hidden lg:block relative">
                <img 
                    src="https://images.pexels.com/photos/247839/pexels-photo-247839.jpeg?_gl=1*fxvuuz*_ga*NjcwNTI3ODM2LjE3NTcyMjg0NDU.*_ga_8JE65Q40S6*czE3NTcyMjg0NDUkbzEkZzEkdDE3NTcyMjg0OTkkajYkbDAkaDA." 
                    alt="Students collaborating in a class" 
                    className="object-cover object-center h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-10 left-10 p-4">
                    <h2 className="text-3xl font-bold text-white">Streamline Your School's Attendance</h2>
                    <p className="text-slate-200 mt-2 max-w-lg">Our system provides an effortless way for teachers and administrators to track student presence accurately and efficiently.</p>
                </div>
            </div>
        </div>
    );
}