import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "../../../services/axiosinstance";

const credentialInstance = CredentialsProvider({
  async authorize(credentials) {
    try {
        const { email, password } = credentials;

    const res = await axiosInstance.post("/users/login", { email, password });
    
    console.log({res: res.data.data})
    const user = res.data.data.result;

    return user; // { user_id : 90, accesstoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTk1MDg2Nzd9.VFmHxjOPtJC1lI3cO8EYsD7mtKlMWGQy8Dd-Htbdtx8'}
    } catch (error) {
        console.log(`yang ini boy ${error.response.data.message}`)
        throw error.response.data;
        
    }
  },
});

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [credentialInstance],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
