import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from "../../../lib/mongodb"
import { MongoDBAdapter } from '@auth/mongodb-adapter'

export const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user}) => {
      if (session?.user?.email){
        return session;
      }
      else{
        return false;
      }
    }
  },
};

const fetchAdminEmails = async () => {
  try {
    const { data } = await axios.get('/api/admin');
    return [...adminEmails, ...data.map(admin => admin.mail)];
  } catch (error) {
    console.error('Error fetching admin emails', error);
    throw new Error('Unable to fetch admin emails');
  }
};

/* export async function isAdminRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOption);

    if (!session?.user?.email) {
      res.status(401).end('Not authenticated');
      return;
    }

    const allAdminEmails = await fetchAdminEmails();

    if (!allAdminEmails.includes(session.user.email)) {
      res.status(401).end('Not an admin');
      return;
    }

    // Admin check passed, proceed with request handling
  } catch (error) {
    res.status(500).end('Internal Server Error');
  }
} */

export default NextAuth(authOption);