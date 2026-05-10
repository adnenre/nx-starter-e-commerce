import { Router, Response } from 'express';
import { AuthService } from './auth';
import { authenticate, AuthRequest } from './auth.middleware';

const router = Router();
const authService = new AuthService();

function setAuthCookie(res: Response, token: string): void {
  res.cookie('token', token, authService.getCookieOptions());
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const user = await authService.register(name, email, password);
    const token = authService.generateJwt(user);
    setAuthCookie(res, token);
    return res.status(201).json({ success: true, data: { user } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'User already exists' ? 409 : 500;
    return res.status(status).json({ success: false, error: message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password required' });
    }
    const user = await authService.login(email, password);
    const token = authService.generateJwt(user);
    setAuthCookie(res, token);
    return res.json({ success: true, data: { user } });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Invalid credentials';
    return res.status(401).json({ success: false, error: message });
  }
});

router.get('/me', authenticate, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: 'User not authenticated' });
  }
  const user = authService.findUserById(userId);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }
  return res.json({ success: true, data: { user } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', authService.getCookieOptions());
  return res.json({ success: true, message: 'Logged out' });
});

export default router;
