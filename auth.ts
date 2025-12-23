import credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.NEXT_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
      async profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email:
            profile.email ||
            `${profile.id}+${profile.login}@users.noreply.github.com`,
          image: profile.avatar_url,
          _id: "",
          role: "User",
          token: "",
          refreshToken: "",
        };
      },
    }),
    credentials({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await response.json();

          if (response.ok && user?.data) {
            return {
              _id: user.data._id,
              role: user.data.role,
              email: user.data.email,
              token: user.token,
              refreshToken: user.refreshToken,
            };
          }
          // throw new Error(user.message || "Authentication failed");
          // Return null if user data could not be retrieved
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 86400, //1hour
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        // Handle Google provider
        if (account.provider === "google") {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASEURL}/auth/google-login`,
              {
                email: profile?.email || user.email,
                name: profile?.name || user.name,
                picture: profile?.picture || user.image,
                googleId: profile?.sub,
              }
            );

            const savedUser = response.data?.data;

            return {
              ...token,
              _id: savedUser._id,
              role: savedUser.role,
              email: savedUser.email,
              token: response.data.token,
              refreshToken: response.data.refreshToken,
            };
          } catch (error) {
            console.error("Error saving Google user to DB:", error);
            return token;
          }
        }

        // Handle GitHub provider
        if (account.provider === "github") {
          try {
            const email =
              user.email ||
              `${profile?.id}+${profile?.login}@users.noreply.github.com`;

            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASEURL}/auth/github-login`,
              {
                email,
                name: profile?.name || profile?.login || user.name,
                picture: profile?.avatar_url || user.image,
                githubId: profile?.id?.toString(),
              }
            );

            if (response.data?.data) {
              return {
                ...token,
                _id: response.data.data._id,
                role: response.data.data.role,
                email: response.data.data.email,
                token: response.data.token,
                refreshToken: response.data.refreshToken,
              };
            }
          } catch (error) {
            console.error("Error saving GitHub user to DB:", error);
            return token;
          }
        }

        // Handle credentials provider
        if (account.provider === "credentials") {
          return {
            ...token,
            _id: user._id,
            role: user.role,
            email: user.email,
            token: user.token,
            refreshToken: user.refreshToken,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.role = token.role as string;
        session.user.token = token.token as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/redirect`;
    },
  },

  pages: {
    signIn: "/login",
    error: "/not-found",
  },
});
