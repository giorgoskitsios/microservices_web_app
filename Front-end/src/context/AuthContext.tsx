// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  name: string;
  email: string;
  googleId: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loginWithGoogle: () => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  token: null,
  loginWithGoogle: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // AuthContext.tsx
  useEffect(() => {
    console.log('AuthProvider render');

    // Έλεγχος για το token μόνο όταν το AuthProvider αποδίδεται για πρώτη φορά
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetch('http://localhost:5000/api/auth/currentUser', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          setUser(userInfo);
        })
        .catch((error) => {
          console.error('Σφάλμα κατά την ανάκτηση στοιχείων χρήστη:', error);
        });
    }
  }, []); // Τοποθετώντας ένα κενό array [], διασφαλίζουμε ότι το effect τρέχει μόνο μια φορά

  const loginWithGoogle = () => {
    // Λειτουργία σύνδεσης με Google OAuth
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
