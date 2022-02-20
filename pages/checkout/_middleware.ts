import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwt } from '../../utils';


export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

    const { token = '' } = req.cookies;

    // return new Response('No autorizado', {
    //     status: 401
    // });

    try {
        await jwt.isValidToken( token );
        return NextResponse.next();

    } catch (error) {
        
        // return Response.redirect('/auth/login');
        const requestedPage = req.page.name;
        return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
    }

}


