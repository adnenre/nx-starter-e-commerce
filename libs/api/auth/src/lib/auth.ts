import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@org/models';

// In-memory store (replace with database later)
const users: (User & { passwordHash: string })[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthService {
  async register(name: string, email: string, password: string): Promise<User> {
    const existing = users.find((u) => u.email === email);
    if (existing) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: String(users.length + 1),
      email,
      name,
      role: 'user',
    };
    users.push({ ...newUser, passwordHash });
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const userRecord = users.find((u) => u.email === email);
    if (!userRecord) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const { passwordHash, ...user } = userRecord;
    return user;
  }

  generateJwt(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    };
  }

  findUserById(id: string): User | undefined {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
