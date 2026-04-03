export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

export function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') return next();
  res.status(403).json({ error: 'Admin access required' });
}
