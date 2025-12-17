/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/proxy/backend/:path*',
                destination: 'https://ap-is-seven.vercel.app/api/:path*',
            },
            {
                source: '/api/proxy/student/:path*',
                destination: 'https://ap-q3q62i6z7-ujjwal16895s-projects.vercel.app/api/:path*',
            },
        ];
    },
};

export default nextConfig;
