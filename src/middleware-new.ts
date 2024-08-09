import { clerkMiddleware, createRouteMatcher, } from '@clerk/nextjs/server'
import { authMiddleware } from "@clerk/nextjs/server";

// os endpoint públicos
const isPublicRoute = createRouteMatcher(['/site', '/api/uploadthing', "/agency/sign-in(.*)", "/agency/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {

  // // tudo exceto os endpoints públicos são protegidos
  if (!isPublicRoute(request)) {
    auth().protect();
  }
}, { debug: true });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};