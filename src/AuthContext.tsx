import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Create axios instance with credentials for CORS support
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;

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
    const fetchProfile = async () => {
      try {
        const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
        if (response.data) {
          dispatch({ type: 'RESTORE_SESSION', payload: response.data });
        }
      } catch (error) {
        // No session to restore or session expired
        console.log('No active session found');
      }
    };

    fetchProfile();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await axiosWithCredentials.post(`${USERS_API}/signin`, {
        username,
        password
      });

      if (response.data) {
        const user: User = {
          _id: response.data._id,
          username: response.data.username,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid username or password' });
        return false;
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await axiosWithCredentials.post(`${USERS_API}/signup`, {
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role || 'STUDENT'
      });

      if (response.data) {
        const user: User = {
          _id: response.data._id,
          username: response.data.username,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed' });
        return false;
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during registration';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Username already exists';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
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
      const response = await axiosWithCredentials.put(`${USERS_API}/${state.user._id}`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username
      });

      if (response.data) {
        const updatedUser: User = {
          _id: response.data._id,
          username: response.data.username,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role as 'STUDENT' | 'FACULTY' | 'ADMIN'
        };

        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
        return false;
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred while updating profile';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axiosWithCredentials.post(`${USERS_API}/signout`);
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('kambaz_user');
    localStorage.removeItem('kambaz_login_time');
    localStorage.removeItem('kambaz_remember_user');

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
