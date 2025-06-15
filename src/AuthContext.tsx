import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import * as db from './Database/index'; 

// Types
interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'STUDENT' | 'FACULTY' | 'ADMIN';
}

// Auth Actions
type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_SESSION'; payload: User };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('kambaz_user');
    const loginTime = localStorage.getItem('kambaz_login_time');
    
    if (storedUser && loginTime) {
      try {
        const user = JSON.parse(storedUser);
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        
        // Check if session is still valid (e.g., within 24 hours)
        const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        
        if (currentTime - loginTimestamp < SESSION_DURATION) {
          // Update last activity
          db.updateUser(user._id, { lastActivity: new Date().toISOString() });
          dispatch({ type: 'RESTORE_SESSION', payload: user });
        } else {
          // Session expired, clear storage
          localStorage.removeItem('kambaz_user');
          localStorage.removeItem('kambaz_login_time');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('kambaz_user');
        localStorage.removeItem('kambaz_login_time');
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const dbUser = db.findUserByCredentials(username, password);
      
      if (!dbUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid username or password' });
        return false;
      }

      // Update user login time in database
      const loginTime = new Date().toISOString();
      db.updateUser(dbUser._id, { 
        loginTime: loginTime,
        lastActivity: loginTime 
      });

      const user: User = {
        _id: dbUser._id,
        username: dbUser.username,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        role: dbUser.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
      };

      // Store in localStorage for persistence
      localStorage.setItem('kambaz_user', JSON.stringify(user));
      localStorage.setItem('kambaz_login_time', Date.now().toString());

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during login' });
      return false;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Check if username already exists
      const existingUser = db.findUserByUsername(userData.username);
      if (existingUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Username already exists' });
        return false;
      }

      // Create new user
      const newUser = db.createUser({
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role || 'STUDENT',
        dob: new Date().toISOString().split('T')[0], // Default DOB
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      });

      const user: User = {
        _id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
      };

      // Store in localStorage
      localStorage.setItem('kambaz_user', JSON.stringify(user));
      localStorage.setItem('kambaz_login_time', Date.now().toString());

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during registration' });
      return false;
    }
  };

  // Update Profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!state.user) {
      dispatch({ type: 'SET_ERROR', payload: 'No user logged in' });
      return false;
    }

    try {
      // Update user in database
      const updatedDbUser = db.updateUser(state.user._id, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        lastActivity: new Date().toISOString()
      });

      if (!updatedDbUser) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
        return false;
      }

      const updatedUser: User = {
        _id: updatedDbUser._id,
        username: updatedDbUser.username,
        firstName: updatedDbUser.firstName,
        lastName: updatedDbUser.lastName,
        email: updatedDbUser.email,
        role: updatedDbUser.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
      };

      // Update localStorage
      localStorage.setItem('kambaz_user', JSON.stringify(updatedUser));

      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred while updating profile' });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('kambaz_user');
    localStorage.removeItem('kambaz_login_time');
    localStorage.removeItem('kambaz_remember_user');
    
    // Update last activity in database if user exists
    if (state.user) {
      db.updateUser(state.user._id, { 
        lastActivity: new Date().toISOString() 
      });
    }

    dispatch({ type: 'LOGOUT' });
  };

  // Clear Error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { state } = useAuth();
    
    if (!state.isAuthenticated) {
      return (
        <div style={{
          marginLeft: '240px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Access Denied</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              You must be logged in to access this page.
            </p>
            <a 
              href="/Kambaz/Account/Signin"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
