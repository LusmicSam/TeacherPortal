"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, BookOpen } from 'lucide-react';
import { API_CONFIG } from '@/utils/api';

export default function LoginPage() {
    const [regId, setRegId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Auto-login check
        const session = localStorage.getItem('teacher_session');
        if (session) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = `${API_CONFIG.baseUrl.admin}${API_CONFIG.teacher.login}`;
            console.log("Teacher Login URL:", url);
            const res = await fetch(`${API_CONFIG.baseUrl.teacher || API_CONFIG.baseUrl.admin}${API_CONFIG.teacher.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uni_reg_id: regId, password }),
                credentials: 'include'
            });

            console.log("Teacher Login Status:", res.status);

            const data = await res.json();
            console.log("Teacher Login Response:", data);

            if (res.ok && data.success) {
                // SUCCESS: Save session
                localStorage.setItem('teacher_session', JSON.stringify(data.teacher || data.data));

                // --- TEMPORARY FIX: Background Admin Login ---
                try {
                    console.log("Attempting background admin auth...");
                    await fetch('/api/proxy/backend/university/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'ujjwalkumar16895@gmail.com', password: 'abcd' }),
                        credentials: 'include' // Important for cookies
                    });
                    console.log("Background admin auth completed.");
                } catch (adminErr) {
                    console.error("Background admin auth failed:", adminErr);
                    // We don't block the teacher login if this fails, but it's good to know
                }
                // ---------------------------------------------

                router.push('/dashboard');
            } else {
                setError(data.message || 'Invalid Credentials');
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Connection failed. Please active your university VPN or check internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F19] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Teacher Portal</h1>
                    <p className="text-gray-400">Login to manage your sections</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1">Registration ID</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                value={regId}
                                onChange={(e) => setRegId(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 transition-all font-mono"
                                placeholder="e.g. 123459"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 transition-all"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <div className="text-center text-xs text-gray-500 mt-6">
                        <p>Restricted Access - University Faculty Only</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
