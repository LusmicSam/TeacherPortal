// Use the same Vercel deployment URL as the Admin Platform for consistency
export const API_CONFIG = {
    baseUrl: {
        admin: '/api/proxy/backend',
        student: '/api/proxy/student',
    },

    // Using admin endpoints for data fetching as requested
    admin: {
        sectionAnalytics: (sectionName) => `/university/admin/section-analytics/${sectionName}`,
        subUnitDetails: '/university/admin/analytics/sub-unit-details',
        courseStructure: (courseId) => `/university/admin/course-structure/${courseId}`,
        uLogin: '/university/auth/login',
        unitCompletion: '/auth/teacher/teacher/analytics/unit-completion',
        getPracticeCoursesByBatch: '/university/admin/getPracticeCoursesByBatch',
    },

    courses: (batchId) => `/courses/${batchId}`,

    teacher: {
        login: '/auth/teacher/login'
    },

    student: {
        lookup: '/lookup',
    }
};
