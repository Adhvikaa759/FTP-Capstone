import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAILS = [
  'dhruvkpalli@gmail.com',
  'dgleeson3767@gmail.com',
  'adhvikaaradhamugundan@gmail.com',
  'ishaantampa@gmail.com',
  'benrcharb@gmail.com',
  'pranav.revuri7123@gmail.com',
];

export function configurePassport() {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'ADMIN' : 'VIEWER';

      let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

      if (user) {
        // Promote to ADMIN if they were added to the ADMIN_EMAILS list, but never auto-demote.
        if (role === 'ADMIN' && user.role !== 'ADMIN') {
          user = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
        }
      } else {
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            role,
          },
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}
