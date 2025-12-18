import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Users, TrendingUp, ArrowUpDown } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { SectionDetailSkeleton } from './Skeletons';
import { API_CONFIG } from '../utils/api';

export default function SectionDetailView({ section, onBack, onStudentSelect }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'overall_progress', direction: 'asc' });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // section is just the string name, e.g. "edutest02"
                // or if it's an object, access the name property
                const sectionName = typeof section === 'string' ? section : section.section_name || section;

                // Adjust API base URL logic for Teacher Portal if different, but sticking to provided API_CONFIG structure
                const url = `${API_CONFIG.baseUrl.admin}${API_CONFIG.admin.sectionAnalytics(encodeURIComponent(sectionName))}`;
                const res = await fetch(url, {
                    credentials: 'include'
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                // Failed to fetch
            } finally {
                setLoading(false);
            }
        };

        if (section) {
            fetchAnalytics();
        }
    }, [section]);

    // Sorting Logic
    const sortedStudents = React.useMemo(() => {
        if (!data?.student_performance) return [];
        let sortable = [...data.student_performance];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Exam / CA View State
    const [viewMode, setViewMode] = useState('analytics'); // analytics | exam
    const [showExamModal, setShowExamModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const MOCK_EXAMS = [
        { id: 'ca1', name: 'CA 1 (Cumulative Assessment)', date: '2024-10-15' },
        { id: 'ca2', name: 'CA 2 (Cumulative Assessment)', date: '2024-11-20' },
        { id: 'mid', name: 'Mid-Term Examination', date: '2024-12-10' },
    ];

    const handleExamClick = () => {
        if (viewMode === 'exam') {
            setViewMode('analytics');
            setSelectedExam(null);
        } else {
            setShowExamModal(true);
        }
    };

    const confirmExamSelection = (exam) => {
        setSelectedExam(exam);
        setShowExamModal(false);
        setViewMode('exam');
    };

    if (loading) {
        return <SectionDetailSkeleton />;
    }

    if (!data) return null;

    const { section_metadata, course_performance, student_performance } = data;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-[#0B0F19] animate-in fade-in slide-in-from-right duration-300 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-cyan-500/10 blur-[100px] pointer-events-none opacity-50 dark:opacity-100" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-white/5 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-semibold mb-1">Section Analytics</div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{section_metadata?.section_name}</h2>
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {section_metadata?.total_students} Students</span>
                            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {section_metadata?.total_courses} Courses</span>
                        </div>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExamClick}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${viewMode === 'exam'
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                    >
                        {viewMode === 'exam' ? <TrendingUp className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        {viewMode === 'exam' ? 'View Analytics' : 'Exam (CA)'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {/* 1. ANALYTICS VIEW */}
                {viewMode === 'analytics' && (
                    <div className="flex-1 h-full overflow-hidden flex flex-col md:flex-row animate-in fade-in duration-300">
                        {/* LEFT: Course Performance */}
                        <div className="w-full md:w-80 p-6 border-r border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/20 overflow-y-auto custom-scrollbar shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Course Performance
                            </h3>
                            <div className="space-y-4">
                                {course_performance?.map(course => (
                                    <div key={course.course_id} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{course.course_name}</h4>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-xs text-gray-500 dark:text-gray-500">Avg Score</span>
                                            <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{course.average_score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${course.average_score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Student Table */}
                        <div className="flex-1 p-6 overflow-hidden flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Student Performance
                            </h3>

                            <div className="flex-1 overflow-auto custom-scrollbar border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 dark:bg-white/5 sticky top-0 backdrop-blur-md z-10">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('student_name')}>
                                                Student Name <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                                            </th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Reg ID</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('overall_progress')}>
                                                Progress <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                                            </th>
                                            {/* Dynamic Course Headers */}
                                            {course_performance?.map(c => (
                                                <th key={c.course_id} className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center border-l border-gray-200 dark:border-white/5">
                                                    {c.course_name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {sortedStudents.map(student => (
                                            <tr key={student.student_id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors pointer cursor-pointer" onClick={() => onStudentSelect(student)}>
                                                        {student.student_name}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{student.uni_reg_id}</td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                                        <div className={`w-2 h-2 rounded-full ${student.overall_progress > 75 ? 'bg-emerald-500' : student.overall_progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{student.overall_progress}%</span>
                                                    </div>
                                                </td>
                                                {/* Dynamic Course Cells */}
                                                {course_performance?.map(c => {
                                                    const courseData = student.courses.find(sc => sc.course_id === c.course_id);
                                                    return (
                                                        <td key={c.course_id} className="p-4 text-center border-l border-gray-200 dark:border-white/5">
                                                            {courseData ? (
                                                                <div className="flex flex-col items-center">
                                                                    <span className="font-bold text-gray-900 dark:text-white">{courseData.score}</span>
                                                                    {courseData.status !== 'N/A' && (
                                                                        <span className={`text-[10px] px-1.5 rounded uppercase tracking-wider font-bold ${courseData.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                                            }`}>
                                                                            {courseData.status}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : <span className="text-gray-400 dark:text-gray-600">-</span>}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. EXAM (CA) VIEW */}
                {viewMode === 'exam' && (
                    <div className="flex-1 h-full p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
                        <div className="max-w-6xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedExam?.name || 'Cumulative Assessment (CA)'} Results</h3>
                            <p className="text-gray-500 mb-6">Detailed breakdown of Coding vs MCQ performance for {selectedExam?.date ? `exam conducted on ${selectedExam.date}` : 'the selected assessment'}.</p>

                            <div className="overflow-hidden border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 dark:bg-white/5">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Student Name</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Reg ID</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center">MCQ Marks</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center">Coding Marks</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center">Total</th>
                                            <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-300 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {sortedStudents.map(student => (
                                            <tr key={student.student_id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">{student.student_name}</td>
                                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{student.uni_reg_id}</td>
                                                {/* Hardcoded Data as per request */}
                                                <td className="p-4 text-center font-mono text-gray-600 dark:text-gray-400">10 / 10</td>
                                                <td className="p-4 text-center font-mono text-gray-600 dark:text-gray-400">20 / 20</td>
                                                <td className="p-4 text-center font-bold text-gray-900 dark:text-white">30 / 30</td>
                                                <td className="p-4 text-center">
                                                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Pass</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* EXAM SELECTION MODAL */}
            {showExamModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Assessment</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose an exam to view detailed results.</p>
                        </div>
                        <div className="p-4 space-y-2">
                            {MOCK_EXAMS.map(exam => (
                                <button
                                    key={exam.id}
                                    onClick={() => confirmExamSelection(exam)}
                                    className="w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group border border-transparent hover:border-gray-200 dark:hover:border-white/5"
                                >
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{exam.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">Conducted: {exam.date}</div>
                                    </div>
                                    <ArrowLeft className="w-5 h-5 rotate-180 text-gray-300 group-hover:text-cyan-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button
                                onClick={() => setShowExamModal(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
