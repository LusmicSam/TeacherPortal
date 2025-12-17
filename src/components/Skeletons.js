import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 dark:bg-white/10 ${className}`}
            {...props}
        />
    );
};

export const SectionDetailSkeleton = () => (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-[#0B0F19] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 shrink-0">
            <div className="flex items-center gap-6">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-8 w-48 mb-2" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* LEFT: Course Performance */}
            <div className="w-full md:w-80 p-6 border-r border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/20 shrink-0 space-y-6">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <div className="flex justify-between items-end">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Student Table */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="flex-1 overflow-auto border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 p-4 space-y-4">
                    <div className="flex justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex justify-between gap-4 py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-1/6" />
                            <Skeleton className="h-6 w-1/6 rounded-full" />
                            <div className="flex gap-2 w-1/4 justify-center">
                                <Skeleton className="h-5 w-8" />
                                <Skeleton className="h-5 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
