"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, BookOpen, Users, ChevronRight, LayoutGrid, User, Layers } from 'lucide-react';
import SectionDetailView from '@/components/SectionDetailView';
import StudentDetailView from '@/components/StudentDetailView';
import { CircularProgress } from '@/components/CircularProgress';
import ThemeToggle from '@/components/ThemeToggle';
import { API_CONFIG } from '@/utils/api';

export default function DashboardPage() {
    const router = useRouter();
    const [teacher, setTeacher] = useState(null);
    const [activeTab, setActiveTab] = useState('sections'); // sections | search
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        // Auth Check
        const session = localStorage.getItem('teacher_session');
        if (!session) {
            router.push('/');
            return;
        }
        setTeacher(JSON.parse(session));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('teacher_session');
        router.push('/');
    };

    const handleStudentSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        const fetchUrl = `${API_CONFIG.baseUrl.student}${API_CONFIG.student.lookup}`;
        console.log("Searching Student URL:", fetchUrl);

        try {
            // Using the lookup API
            const res = await fetch(fetchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'uni_reg_id', value: searchQuery }),
                credentials: 'include'
            });
            const json = await res.json();
            const results = Array.isArray(json.data) ? json.data : (json.data ? [json.data] : []);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    if (!teacher) return null; // Or a loading spinner

    // Render Logic
    // Render Logic
    if (selectedStudent) {
        return (
            <StudentDetailView
                student={selectedStudent}
                onBack={() => setSelectedStudent(null)}
            />
        );
    }

    if (selectedSection) {
        return (
            <SectionDetailView
                section={selectedSection} // Pass the string name directly as expected by the component
                onBack={() => setSelectedSection(null)}
                onStudentSelect={(student) => setSelectedStudent(student)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-200 dark:bg-[#0B0F19] transition-colors p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 shadow-xl shrink-0 animate-in fade-in slide-in-from-top duration-500 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Teacher Portal</h1>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {teacher.teacher_name || teacher.name}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 transition-all font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                {/* <div className="flex gap-4 border-b border-gray-300 dark:border-white/10 pb-4 overflow-x-auto">
                    ... Tabs removed in favor of direct view if preferred, or keep them. 
                    Let's align with Admin Panel which has top-level navigation blocks.
                </div> */}

                {/* We will keep the tabs but style them better or just show Sections by default as 'Cards' */}

                {/* Navigation Tabs */}
                <div className="flex gap-4 border-b border-gray-300 dark:border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab('sections')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'sections'
                            ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> My Sections
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'search'
                            ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <Search className="w-4 h-4" /> Student Lookup
                    </button>
                </div>

                <div className="min-h-[500px] animate-in fade-in duration-300">
                    {/* Section 1: My Sections */}
                    {activeTab === 'sections' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assigned Sections</h2>
                                <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 font-mono">
                                    {teacher.assigned_section?.length || 0} Total
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(teacher.assigned_section || teacher.assigned_sections || []).map((sectionName, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSection(sectionName)}
                                        className="relative group flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-[#1e293b]/80 transition-all duration-300 shadow-lg"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{sectionName}</h3>
                                        <span className="text-xs text-gray-500 font-mono uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full">View Data</span>

                                        {/* Hover Effect */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Quick Actions (Search) */}
                    {activeTab === 'search' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">Find a Student</h2>
                            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                                {/* Search Form */}
                                <form onSubmit={handleStudentSearch} className="relative mb-8 z-10">
                                    <Search className="absolute left-5 top-5 w-6 h-6 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Enter Registration ID (e.g. 11212345)..."
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-2xl pl-14 pr-4 py-5 text-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-600 font-mono"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-3 bottom-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors"
                                    >
                                        Search
                                    </button>
                                </form>

                                {/* Search Results */}
                                <div className="space-y-3 z-10 relative">
                                    {isSearching ? (
                                        <div className="text-center py-10">
                                            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-gray-500">Searching university database...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((student) => (
                                            <button
                                                key={student.student_id || student.id}
                                                onClick={() => setSelectedStudent(student)}
                                                className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group border border-white/5 hover:border-cyan-500/30"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {(student.student_name?.[0] || 'S').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{student.student_name}</div>
                                                        <div className="text-sm text-gray-400 font-mono">{student.uni_reg_id || student.reg_id}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-cyan-400 transition-colors">
                                                    View Profile <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </button>
                                        ))
                                    ) : searchQuery && (
                                        <div className="text-center py-12 text-gray-500">
                                            <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                                                <Search className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p>No student found with ID <span className="font-mono text-cyan-400">{searchQuery}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
