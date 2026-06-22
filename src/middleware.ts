import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware((auth, req: NextRequest) => {
  // Redirect old tabletop-gaming URL to trading-card-gaming
  if (req.nextUrl.pathname === '/camps/tabletop-gaming') {
    return NextResponse.redirect(new URL('/camps/trading-card-gaming', req.url), 301);
  }
  
  // Continue with normal Clerk middleware
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
