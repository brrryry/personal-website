import {NextResponse} from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
    // Check if the request is for a protected route
    const protectedRoutes = ['/dashboard', '/profile'];
    const url = request.nextUrl;
    
    if (protectedRoutes.includes(url.pathname)) {
        // Check for session cookie
        const sessionId = request.cookies.get('sessionId');
    
        if (!sessionId) {
        // Redirect to login if sessionId is not found
        return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // Optionally, you can add logic to validate the sessionId here
    }
    
    // Continue with the request if no issues
    return NextResponse.next();
    }

export const config = {
    matcher: ['/nano']
}