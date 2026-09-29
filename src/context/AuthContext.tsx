import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnyUserProfile, UserRole, StudentProfile, MentorProfile, RecruiterProfile, AcademicAdminProfile } from '../types';
import { AuthService, RegisterStudentData, RegisterMentorData, RegisterRecruiterData, RegisterAcademicAdminData } from '../services/auth';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: AnyUserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  registerStudent: (data: RegisterStudentData) => Promise<StudentProfile>;
  registerMentor: (data: RegisterMentorData) => Promise<MentorProfile>;
  registerRecruiter: (data: RegisterRecruiterData) => Promise<RecruiterProfile>;
  registerAcademicAdmin: (data: RegisterAcademicAdminData) => Promise<AcademicAdminProfile>;
  refreshUser: () => void;
  clearAllSystemData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AnyUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    const user = AuthService.login(email, role);
    setCurrentUser(user);
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const registerStudent = async (data: RegisterStudentData) => {
    const user = AuthService.registerStudent(data);
    setCurrentUser(user);
    return user;
  };

  const registerMentor = async (data: RegisterMentorData) => {
    const user = AuthService.registerMentor(data);
    setCurrentUser(user);
    return user;
  };

  const registerRecruiter = async (data: RegisterRecruiterData) => {
    const user = AuthService.registerRecruiter(data);
    setCurrentUser(user);
    return user;
  };

  const registerAcademicAdmin = async (data: RegisterAcademicAdminData) => {
    const user = AuthService.registerAcademicAdmin(data);
    setCurrentUser(user);
    return user;
  };

  const clearAllSystemData = () => {
    StorageService.clearAllData();
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        isLoading,
        login,
        logout,
        registerStudent,
        registerMentor,
        registerRecruiter,
        registerAcademicAdmin,
        refreshUser,
        clearAllSystemData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
