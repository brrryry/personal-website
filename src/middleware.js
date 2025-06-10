import {NextResponse} from 'next/server';


export async function middleware(request) {

    console.log(`Middleware triggered for ${request.nextUrl.pathname}`);
    const loginRoutes = ["/login", "/register"]
    
    // Get sessionid cookie
    const sessionId = request.cookies.get('sessionid');

    // If session ID exists, proceed with the request
    const url = request.nextUrl.origin + '/api/account/session';
    
    try {
        //make a post request to the session endpoint
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: sessionId ? sessionId.value : null }),
        });

        if (!response.ok) {
            return NextResponse.next({
                headers: {
                    'isLoggedIn': 'false',
                },
            })
        }

        const data = await response.json();

        if (data.error) {
            return NextResponse.next({
                headers: {
                    'isLoggedIn': 'false',
                },
            });
        }

        // If the session is valid, set the igLoggedIn header
        if(response.ok && loginRoutes.includes(request.nextUrl.pathname)) {
            //redirect to home page if logged in
            return NextResponse.redirect(request.nextUrl.origin + '/', {
                headers: {
                    'isLoggedIn': 'true',
                    'username': data?.username,
                    'nano': data.nano ? 'true' : 'false',
                    'sessionId': sessionId ? sessionId.value : '',
                },
            });
        }



        return NextResponse.next({
            headers: {
                'isLoggedIn': 'true',
                'username': data?.username,
                'nano': data.nano ? 'true' : 'false',
                'sessionId': sessionId ? sessionId : '',
            },
        });
    } catch (error) {
        console.error(`Error fetching session: ${error.message}`);
        return NextResponse.next();
    }


    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}