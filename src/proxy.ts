import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Guards every /admin route except /admin/login itself (the negative
  // lookahead), which must stay reachable so a signed-out admin can sign in.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
