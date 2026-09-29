import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MentorProfile } from '../../../types';
import { StorageService } from '../../../services/storage';
import { EmptyState } from '../../common/EmptyState';
import { 
  User, 
  Compass, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Calendar,
  Send
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const mentor = currentUser as MentorProfile;

  const [activeTab, setActiveTab] = useState<'requests' | 'subjects' | 'profile' | 'resources'>('requests');
  const [newSubject, setNewSubject] = useState('');
  
  // Edit Profile Form State
  const [editBio, setEditBio] = useState(mentor?.bio || '');
  const [editAvailability, setEditAvailability] = useState(mentor?.availability || '');
  const [editWhatsApp, setEditWhatsApp] = useState(mentor?.whatsAppNumber || '');
  const [editTelegram, setEditTelegram] = useState(mentor?.telegramUrl || '');
  const [editInstagram, setEditInstagram] = useState(mentor?.instagramId || '');
  const [editPortfolio, setEditPortfolio] = useState(mentor?.portfolioUrl || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // New Resource
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('');

  // Fetch connection requests for this mentor
  const connectionRequests = StorageService.getConnectionRequestsByMentor(mentor?.id || '');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const current = mentor.subjectsTaught || [];
    if (!current.includes(newSubject.trim())) {
      const updated: MentorProfile = {
        ...mentor,
        subjectsTaught: [...current, newSubject.trim()]
      };
      StorageService.saveUser(updated);
      refreshUser();
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    const updated: MentorProfile = {
      ...mentor,
      subjectsTaught: (mentor.subjectsTaught || []).filter(s => s !== subjectToRemove)
    };
    StorageService.saveUser(updated);
    refreshUser();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MentorProfile = {
      ...mentor,
      bio: editBio,
      availability: editAvailability,
      whatsAppNumber: editWhatsApp,
      telegramUrl: editTelegram,
      instagramId: editInstagram,
      portfolioUrl: editPortfolio,
    };
    StorageService.saveUser(updated);
    refreshUser();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleUpdateStatus = (connectionId: string, status: 'connected' | 'declined') => {
    StorageService.updateConnectionStatus(connectionId, status);
    refreshUser();
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    StorageService.saveLearningResource({
      title: resTitle.trim(),
      authorId: mentor.id,
      authorName: mentor.name,
      authorRole: 'mentor',
      category: 'Mentor Masterclass',
      url: resUrl.trim(),
      description: resDesc.trim(),
      tags: mentor.subjectsTaught || [],
      difficulty: 'Advanced'
    });
    setResTitle('');
    setResDesc('');
    setResUrl('');
    alert('Masterclass resource published to SkillBridge!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Mentor Banner */}
      <div className="hud-corner rounded-2xl border border-purple-500/30 bg-[#0e0a14] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
              VERIFIED MENTOR
            </span>
            <span className="font-mono text-xs text-slate-400">{mentor?.professionalRole} // {mentor?.industry}</span>
          </div>
          <h1 className="hud-heading text-2xl sm:text-3xl font-black text-white">
            {mentor?.name}
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Availability: <strong className="text-purple-300">{mentor?.availability}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-black border border-purple-500/40 text-purple-300">
            {mentor?.experienceYears} Years Experience
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-xl bg-black/60 p-1 border border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'requests', label: 'STUDENT REQUESTS', icon: MessageSquare, count: connectionRequests.length },
          { id: 'subjects', label: 'TEACHING SUBJECTS', icon: Compass, count: mentor?.subjectsTaught?.length || 0 },
          { id: 'profile', label: 'PROFILE & LINKS', icon: User },
          { id: 'resources', label: 'PUBLISH MASTERCLASS', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-black text-purple-300' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONNECTION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0d10] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              STUDENT CONNECTION REQUESTS
            </h3>
            <p className="text-xs text-slate-400">
              Students reach out to you based on your registered teaching subjects and experience.
            </p>
          </div>

          {connectionRequests.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No student requests yet."
              description="When students discover your teaching subjects and submit a mentorship request, their details and messages will stream here."
              variant="neutral"
            />
          ) : (
            <div className="space-y-4">
              {connectionRequests.map(req => (
                <div
                  key={req.id}
                  className="hud-corner rounded-xl border border-slate-800 bg-[#0e0a14] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{req.studentName}</h4>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-purple-500/30 text-purple-300">
                        {req.subjectOfInterest}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-400">{req.studentEmail} • {new Date(req.createdAt).toLocaleDateString()}</div>
                    <p className="text-xs text-slate-300 mt-2 font-sans bg-black/40 p-2.5 rounded border border-slate-800">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'connected')}
                          className="px-3 py-1.5 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'declined')}
                          className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 font-rajdhani text-xs uppercase cursor-pointer hover:bg-red-950/30"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="font-mono text-xs px-2.5 py-1 rounded border uppercase bg-purple-500/20 text-purple-300 border-purple-500/40">
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHING SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0d10] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-2">ADD TEACHING SUBJECT</h3>
            <form onSubmit={handleAddSubject} className="flex gap-3">
              <input
                type="text"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="e.g. Distributed Systems, GraphQL, Next.js"
                className="flex-1 px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-rajdhani font-bold text-xs uppercase cursor-pointer"
              >
                + ADD SUBJECT
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(mentor?.subjectsTaught || []).map((sub, i) => (
              <div key={i} className="hud-corner rounded-xl border border-slate-800 bg-[#0e0a14] p-4 flex items-center justify-between">
                <span className="font-bold text-white text-sm">{sub}</span>
                <button
                  onClick={() => handleRemoveSubject(sub)}
                  className="p-1.5 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & CONNECTION LINKS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0d10] p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="hud-heading text-lg font-bold text-white mb-2">MENTOR CONTACT DETAILS</h3>
          <p className="text-xs text-slate-400 mb-4">
            Students can reach out directly using these connection channels.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Mentor Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Availability Schedule</label>
            <input
              type="text"
              value={editAvailability}
              onChange={e => setEditAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={editWhatsApp}
                onChange={e => setEditWhatsApp(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Telegram URL</label>
              <input
                type="text"
                value={editTelegram}
                onChange={e => setEditTelegram(e.target.value)}
                placeholder="https://t.me/username"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Instagram ID</label>
              <input
                type="text"
                value={editInstagram}
                onChange={e => setEditInstagram(e.target.value)}
                placeholder="@handle"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Portfolio Link</label>
              <input
                type="url"
                value={editPortfolio}
                onChange={e => setEditPortfolio(e.target.value)}
                placeholder="https://portfolio.dev"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {profileSaved && (
            <p className="font-mono text-xs text-[#00FF66] flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Profile credentials updated.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-rajdhani font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            UPDATE MENTOR PROFILE
          </button>
        </form>
      )}

      {/* TAB 4: PUBLISH MASTERCLASS */}
      {activeTab === 'resources' && (
        <form onSubmit={handleAddResource} className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0d10] p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="hud-heading text-lg font-bold text-white mb-1">PUBLISH MENTOR MASTERCLASS</h3>
          <p className="text-xs text-slate-400">
            Share curated roadmaps or technical articles with the SkillBridge student network.
          </p>

          <input
            type="text"
            required
            value={resTitle}
            onChange={e => setResTitle(e.target.value)}
            placeholder="Masterclass Title"
            className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
          />
          <input
            type="url"
            value={resUrl}
            onChange={e => setResUrl(e.target.value)}
            placeholder="Link (Notion, GitHub, Video)"
            className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
          />
          <textarea
            rows={3}
            required
            value={resDesc}
            onChange={e => setResDesc(e.target.value)}
            placeholder="Summary of concepts covered..."
            className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-rajdhani font-bold text-xs uppercase cursor-pointer"
          >
            PUBLISH TO SKILLBRIDGE LEARN
          </button>
        </form>
      )}

    </div>
  );
};
