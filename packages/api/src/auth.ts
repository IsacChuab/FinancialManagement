// import express from 'express';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import jwt from 'jsonwebtoken';
// import { connectDB } from './db';

// const router = express.Router();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const db = await connectDB();
//         const users = db.collection('users');
//         const user = await users.findOneAndUpdate(
//           { googleId: profile.id },
//           {
//             $set: {
//               googleId: profile.id,
//               displayName: profile.displayName,
//               emails: profile.emails,
//             },
//           },
//           { upsert: true, returnDocument: 'after' },
//         );

//         return done(null, user.value);
//       } catch (err) {
//         return done(err as Error);
//       }
//     },
//   ),
// );

// // trigger
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // callback
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: '/' }),
//   (req, res) => {
//     // @ts-ignore
//     const user = req.user;
//     const token = jwt.sign({ id: user._id, googleId: user.googleId }, process.env.JWT_SECRET!, {
//       expiresIn: '7d',
//     });

//     // Redirect to front with token
//     const redirectTo = `${process.env.VITE_FRONT_URL ?? 'http://localhost:5173'}/?token=${token}`;
//     res.redirect(redirectTo);
//   },
// );

// export default router;
