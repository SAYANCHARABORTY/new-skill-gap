import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { CyberBackground } from './components/common/CyberBackground';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectorModal } from './components/common/RoleSelectorModal';
import { AuthModal } from './components/auth/AuthModals';
import { NirvanaTerminal } from './components/nirvana/NirvanaTerminal';
import { StudentDashboard } from './components/roles/student/StudentDashboard';
import { MentorDashboard } from './components/roles/mentor/MentorDashboard';
import { RecruiterDashboard } from './components/roles/recruiter/RecruiterDashboard';
import { AcademicDashboard } from './components/roles/academic/AcademicDashboard';

const MainApp: React.FC = () => {
  const { currentUser, role } = useAuth();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRoleForAuth, setSelectedRoleForAuth] = useState<UserRole>('student');
  const [nirvanaOpen, setNirvanaOpen] = useState(false);
  const [forceLanding, setForceLanding] = useState(false);

  const handleSelectRoleFromModal = (chosenRole: UserRole) => {
    setSelectedRoleForAuth(chosenRole);
    setRoleModalOpen(false);
    setAuthModalOpen(true);
  };

  const handleNavigate = (view: string) => {
    if (view === 'landing') {
      setForceLanding(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070908] text-slate-100 selection:bg-[#00FF66] selection:text-black">
      {/* Background Cyber Mesh & Grids */}
      <CyberBackground />

      {/* Top Navbar */}
      <Navbar
        onOpenRoleModal={() => setRoleModalOpen(true)}
        onOpenNirvana={() => setNirvanaOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {currentUser && !forceLanding ? (
          <div>
            {role === 'student' && <StudentDashboard onOpenNirvana={() => setNirvanaOpen(true)} />}
            {role === 'mentor' && <MentorDashboard />}
            {role === 'recruiter' && <RecruiterDashboard />}
            {role === 'academic' && <AcademicDashboard />}
          </div>
        ) : (
          <LandingPage
            onOpenRoleModal={() => setRoleModalOpen(true)}
            onOpenNirvana={() => setNirvanaOpen(true)}
            onSelectRole={handleSelectRoleFromModal}
          />
        )}
      </main>

      {/* Role Selection Modal ("WHAT BRINGS YOU TO SKILLBRIDGE?") */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSelectRole={handleSelectRoleFromModal}
        onOpenNirvana={() => {
          setRoleModalOpen(false);
          setNirvanaOpen(true);
        }}
      />

      {/* Authentication Modal (Registration & Login for each role) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={selectedRoleForAuth}
        onSuccess={() => {
          setForceLanding(false);
        }}
      />

      {/* NIRVANA AI Guide Terminal */}
      <NirvanaTerminal
        isOpen={nirvanaOpen}
        onClose={() => setNirvanaOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
