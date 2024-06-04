



import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies';



console.log("is everything ok");


const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("here it is")
    return;
  }
  try {
    await mongoose.connect("mongodb+srv://okayxyz91:Smriti%4015@cluster0.ws7xmqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};
console.log('NextAuth configuration loaded');
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          if (user && bcrypt.compareSync(credentials.password, user.password)) {

            return { email: user.email, role: user.role, id: user._id };
          }else {
            console.log("User not found or password incorrect");
          }
        } catch (error) {
          console.error('Error authorizing user:', error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      if (token.user) {
        setCookie(null, 'next-auth.session-token', JSON.stringify(token), {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          // httpOnly: true,
          sameSite: 'lax',
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.user.role = token.user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/error', // Error code passed in query string as ?error=
  },
});
