import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn) {
                    const userRole = auth.user.role as string;
                    // Admin has full access
                    if (userRole === 'ADMIN') return true;

                    // Customer restrictions
                    if (userRole === 'CUSTOMER') {
                        const allowedPaths = ['/admin', '/admin/siparisler', '/admin/teklif', '/admin/ekstre'];
                        const isAllowed = allowedPaths.some(path =>
                            nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
                        );

                        // Dashboard is /admin, so it matches exactly or starts with /admin/
                        // We need to be careful not to allow /admin/users just because it starts with /admin
                        // The logic above:
                        // /admin matches /admin
                        // /admin/users matches /admin/users (starts with /admin/) -> Wait, this logic is flawed if I just check startsWith /admin

                        // Refined logic for Customer:
                        if (nextUrl.pathname === '/admin') return true; // Dashboard
                        if (nextUrl.pathname.startsWith('/admin/siparisler')) return true;
                        if (nextUrl.pathname.startsWith('/admin/teklif')) return true;
                        if (nextUrl.pathname.startsWith('/admin/ekstre')) return true;

                        return false; // Block other admin routes
                    }

                    // Sales restrictions (example, assuming similar to Admin for now or specific)
                    if (userRole === 'SALES') return true; // Or define specific paths

                    return true; // Default allow for other roles if any, or restrict
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/admin', nextUrl));
            }
            return true;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
