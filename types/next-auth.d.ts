import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id: string;
    role: string;
    email: string;
    token: string;
    picture?: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  interface Session {
    user: {
      _id: string;
      role: string;
      email: string;
      token: string;
      refreshToken: string;
      accessTokenExpires: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    email: string;
    role: string;
    token: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
