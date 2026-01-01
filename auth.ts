import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import axios from "axios";

/* -----------------------------
   Constants
----------------------------- */
const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 * 1000; // 15 minutes (ms)

/* -----------------------------
   Refresh Access Token
----------------------------- */
async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/refresh`,
      { refreshToken: token.refreshToken }
    );

    return {
      ...token,
      token: response.data.accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min
    };
  } catch (error) {
    console.error("❌ Refresh access token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/* -----------------------------
   NextAuth
----------------------------- */
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
  name: "Credentials",
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );

    const user = await response.json();
    if (!response.ok || !user?.data) return null;

    // Return full User object matching your types
    return {
      _id: user.data._id,
      email: user.data.email,
      role: user.data.role,
      token: user.token,
      refreshToken: user.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  },
})
,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent", access_type: "offline" } },
    }),
    GitHub({
      clientId: process.env.NEXT_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign-in
      if (account && user) {
        if (account.provider === "credentials") {
            return {
              _id: user._id,
              role: user.role,
              email: user.email,
              token: user.token,
              refreshToken: user.refreshToken,
              accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN
            };
        } else if (account.provider === "google") {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASEURL}/auth/google-login`,
            {
              email: profile?.email,
              name: profile?.name,
              picture: profile?.picture,
              googleId: profile?.sub,
            }
          );
          token._id = res.data.data._id;
          token.email = res.data.data.email;
          token.role = res.data.data.role;
          token.token = res.data.token;
          token.refreshToken = res.data.refreshToken;
          token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        } else if (account.provider === "github") {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASEURL}/auth/github-login`,
            {
              email: profile?.email,
              name: profile?.name,
              picture: profile?.picture,
              githubId: profile?.id?.toString(),
            }
          );
          token._id = res.data.data._id;
          token.email = res.data.data.email;
          token.role = res.data.data.role;
          token.token = res.data.token;
          token.refreshToken = res.data.refreshToken;
          token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        }
      }

      // Token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.token = token.token;
        session.user.refreshToken = token.refreshToken;
        session.user.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
  },
});
