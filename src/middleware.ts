import { type NextRequest,NextResponse } from "next/server";
import { validateSession } from "./lib/auth";
import { removeCookies } from "./components/CookiesManagement";

export async function middleware(request: NextRequest) {

  const session = await validateSession();
  const path = request.nextUrl.pathname;

  if (!session && path !== "/login" ) {
    removeCookies("vouchers");
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  if (request.url.includes("/login")){
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/"]
}