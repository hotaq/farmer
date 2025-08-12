// Rule-based authentication system for MVP
// This replaces Supabase auth with local storage and simple validation

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  location: string;
  userType: 'producer' | 'partner';
  bio: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: 'demo-producer-1',
    email: 'producer@demo.com',
    fullName: 'Demo Producer',
    phone: '+1234567890',
    location: 'California, USA',
    userType: 'producer',
    bio: 'Organic farm producer specializing in vegetables',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-partner-1',
    email: 'partner@demo.com',
    fullName: 'Demo Partner',
    phone: '+0987654321',
    location: 'New York, USA',
    userType: 'partner',
    bio: 'Agricultural supply chain partner',
    createdAt: new Date().toISOString()
  }
];

// Simple user storage using localStorage
class RuleBasedAuth {
  private static instance: RuleBasedAuth;
  private users: Map<string, User> = new Map();
  private currentUser: User | null = null;
  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeDemoUsers();
      this.loadUsersFromStorage();
      this.loadCurrentUserFromStorage();
    }
  }

  static getInstance(): RuleBasedAuth {
    if (!RuleBasedAuth.instance) {
      RuleBasedAuth.instance = new RuleBasedAuth();
    }
    return RuleBasedAuth.instance;
  }

  // Initialize demo users if no users exist
  private initializeDemoUsers() {
    try {
      const storedUsers = localStorage.getItem('agri-connect-users');
      if (!storedUsers) {
        DEMO_USERS.forEach(user => {
          this.users.set(user.email, user);
        });
        this.saveUsersToStorage();
        
        // Set demo passwords
        const passwords = { 'producer@demo.com': 'demo', 'partner@demo.com': 'demo' };
        this.savePasswords(passwords);
      }
    } catch (error) {
      console.error('Error initializing demo users:', error);
    }
  }

  // Load users from localStorage
  private loadUsersFromStorage() {
    try {
      const storedUsers = localStorage.getItem('agri-connect-users');
      if (storedUsers) {
        const usersArray: User[] = JSON.parse(storedUsers);
        usersArray.forEach(user => {
          this.users.set(user.email, user);
        });
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
    }
  }

  // Save users to localStorage
  private saveUsersToStorage() {
    try {
      const usersArray = Array.from(this.users.values());
      localStorage.setItem('agri-connect-users', JSON.stringify(usersArray));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  // Load current user from localStorage
  private loadCurrentUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('agri-connect-current-user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error loading current user from storage:', error);
    }
  }

  // Save current user to localStorage
  private saveCurrentUserToStorage() {
    try {
      if (this.currentUser) {
        localStorage.setItem('agri-connect-current-user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('agri-connect-current-user');
      }
    } catch (error) {
      console.error('Error saving current user to storage:', error);
    }
  }

  // Notify listeners of state changes
  private notifyListeners() {
    const state: AuthState = {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false
    };
    this.listeners.forEach(listener => listener(state));
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener({
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false
    });
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Sign up a new user
  async signUp(userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    location: string;
    userType: 'producer' | 'partner';
    bio: string;
  }): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      if (this.users.has(userData.email)) {
        return { user: null, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        location: userData.location,
        userType: userData.userType,
        bio: userData.bio,
        createdAt: new Date().toISOString()
      };

      // Store user
      this.users.set(userData.email, newUser);
      this.saveUsersToStorage();

      // Store password separately (in real app, this would be hashed)
      const passwords = this.getStoredPasswords();
      passwords[userData.email] = userData.password;
      this.savePasswords(passwords);

      return { user: newUser, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to create user account' };
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const user = this.users.get(email);
      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Check password
      const passwords = this.getStoredPasswords();
      if (passwords[email] !== password) {
        // Provide hint for demo users
        const isDemoUser = DEMO_USERS.some(demoUser => demoUser.email === email);
        if (isDemoUser) {
          return { user: null, error: 'Invalid password. Hint: Use "demo" as password for demo accounts.' };
        }
        return { user: null, error: 'Invalid email or password' };
      }

      // Set current user
      this.currentUser = user;
      this.saveCurrentUserToStorage();
      this.notifyListeners();

      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to sign in' };
    }
  }

  // Sign out user
  async signOut(): Promise<{ error: string | null }> {
    try {
      this.currentUser = null;
      this.saveCurrentUserToStorage();
      this.notifyListeners();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to sign out' };
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current auth state
  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false
    };
  }

  // Password storage helpers (simplified for MVP)
  private getStoredPasswords(): Record<string, string> {
    try {
      const stored = localStorage.getItem('agri-connect-passwords');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private savePasswords(passwords: Record<string, string>) {
    try {
      localStorage.setItem('agri-connect-passwords', JSON.stringify(passwords));
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  }

  // Get all users (for admin purposes or testing)
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Clear all data (for testing)
  clearAllData() {
    this.users.clear();
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agri-connect-users');
      localStorage.removeItem('agri-connect-current-user');
      localStorage.removeItem('agri-connect-passwords');
    }
    this.notifyListeners();
  }
}

// Export singleton instance
export const ruleBasedAuth = RuleBasedAuth.getInstance();

// Export auth methods for easy use
export const auth = {
  signUp: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    location: string;
    userType: 'producer' | 'partner';
    bio: string;
  }) => ruleBasedAuth.signUp(userData),
  
  signIn: (email: string, password: string) => ruleBasedAuth.signIn(email, password),
  
  signOut: () => ruleBasedAuth.signOut(),
  
  getCurrentUser: () => ruleBasedAuth.getCurrentUser(),
  
  getAuthState: () => ruleBasedAuth.getAuthState(),
  
  subscribe: (listener: (state: AuthState) => void) => ruleBasedAuth.subscribe(listener)
};