import bcrypt from 'bcryptjs';

// User role type
export type UserRole = 'owner' | 'admin' | 'user';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  role: UserRole;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  focusGoal?: string;
  preferredMode?: 'focus' | 'calm' | 'energize';
  preferredFrequency?: number;
  timezone?: string;
  notificationsEnabled?: boolean;
  theme?: 'light' | 'dark';
  bio?: string;
  avatar?: string;
}

// In-memory user storage (replace with database in production)
const users: Map<string, User> = new Map();

// Initialize hardcoded admin accounts
async function initializeAdminAccounts() {
  // Only initialize if not already done
  if (users.size > 0) return;

  const adminAccounts = [
    {
      email: 'owner@focusync.app',
      password: 'Owner@123456',
      name: 'Owner Account',
      role: 'owner' as UserRole,
    },
    {
      email: 'admin1@focusync.app',
      password: 'Admin@123456',
      name: 'Admin One',
      role: 'admin' as UserRole,
    },
    {
      email: 'admin2@focusync.app',
      password: 'Admin@123456',
      name: 'Admin Two',
      role: 'admin' as UserRole,
    },
  ];

  for (const account of adminAccounts) {
    const passwordHash = await hashPassword(account.password);
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: account.email,
      name: account.name,
      passwordHash,
      createdAt: Date.now(),
      role: account.role,
      profile: {
        theme: 'dark',
        notificationsEnabled: true,
        preferredMode: 'focus',
        preferredFrequency: 40,
      },
    };
    users.set(user.id, user);
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create user
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'user'
): Promise<User | null> {
  // Check if user exists
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    return null; // User already exists
  }

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    passwordHash,
    createdAt: Date.now(),
    role,
    profile: {
      theme: 'dark',
      notificationsEnabled: true,
      preferredMode: 'focus',
      preferredFrequency: 40,
    },
  };

  users.set(user.id, user);

  // Save to localStorage (client-side) or database (server-side)
  if (typeof window !== 'undefined') {
    const allUsers = JSON.parse(localStorage.getItem('focusync_users') || '{}');
    allUsers[user.id] = user;
    localStorage.setItem('focusync_users', JSON.stringify(allUsers));
  }

  return user;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.email === email);
  return user || null;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<User | null> {
  const user = users.get(userId);
  if (!user) {
    return null;
  }

  user.profile = {
    ...user.profile,
    ...profile,
  };

  users.set(userId, user);

  // Save to localStorage
  if (typeof window !== 'undefined') {
    const allUsers = JSON.parse(localStorage.getItem('focusync_users') || '{}');
    allUsers[userId] = user;
    localStorage.setItem('focusync_users', JSON.stringify(allUsers));
  }

  return user;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = users.get(userId);
  return user?.profile || null;
}

// Delete user
export async function deleteUser(userId: string): Promise<boolean> {
  const deleted = users.delete(userId);

  if (deleted && typeof window !== 'undefined') {
    const allUsers = JSON.parse(localStorage.getItem('focusync_users') || '{}');
    delete allUsers[userId];
    localStorage.setItem('focusync_users', JSON.stringify(allUsers));
  }

  return deleted;
}

// Load users from localStorage on startup
export async function loadUsersFromStorage(): Promise<void> {
  // Initialize admin accounts first
  await initializeAdminAccounts();

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('focusync_users');
    if (stored) {
      try {
        const allUsers = JSON.parse(stored);
        Object.values(allUsers).forEach((user: any) => {
          users.set(user.id, user);
        });
      } catch (error) {
        console.error('Failed to load users from storage:', error);
      }
    }
  }
}

// Check if user is admin or owner
export function isAdmin(user: User): boolean {
  return user.role === 'admin' || user.role === 'owner';
}

// Check if user is owner
export function isOwner(user: User): boolean {
  return user.role === 'owner';
}

// Get user role
export function getUserRole(user: User): UserRole {
  return user.role;
}

// Export user store for testing
export function getUserStore(): Map<string, User> {
  return users;
}

