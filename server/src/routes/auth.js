import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`,
}), (_req, res) => {
  res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ error: 'Not authenticated' });
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

export default router;
