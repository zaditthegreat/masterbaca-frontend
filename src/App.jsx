import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/layout/Layout';
import AIAssistant from './components/AIAssistant';
import MatchNotification from './components/MatchNotification';
import { authService } from './services/authService';
import { studentService } from './services/studentService';
import { chatService } from './services/chatService';
import { assessmentService } from './services/assessmentService';
import AssesmentBriefing from './components/AssesmentBriefing';

// Pages - Authenticated
import Discover from './pages/Discover';
import Groups from './pages/Groups';
import Library from './pages/Library';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import UploadBook from './pages/UploadBook';
import EditBook from './pages/EditBook';
import ChatRoom from './pages/ChatRoom';

// Pages - Guest/Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('explore');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [matchedGroup, setMatchedGroup] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [invitedAssessmentGroup, setInvitedAssessmentGroup] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const knownGroupsRef = useRef(new Set());
  const isFirstLoad = useRef(true);

  const fetchProfile = async () => {
    try {
      const data = await studentService.getMyProfile();
      setCurrentUser(data.user);

      // Handle onboarding requirement
      if (data.force_assess) {
        setIsAssistantOpen(true);
      }

      // Adjust default tab based on role if current tab is not allowed
      const role = data.user.role;
      if (role === 'librarian' && activeTab === 'explore') {
        setActiveTab('library');
      }

    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const pollGroups = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await chatService.getMyGroups();

      // 1. Detect if there's a NEW group (Matchmaking happened)
      if (!isFirstLoad.current) {
        const newGroup = data.find(g => !knownGroupsRef.current.has(g.id));
        if (newGroup) {
          setMatchedGroup(newGroup);
          setIsMatchModalOpen(true);
        }
      }

      // 2. Detect if anyone is asking to finish (askingFinish)
      if (!isFirstLoad.current) {
        const invitingGroup = data.find(g => g.askingFinish && !g.isFinished);
        if (invitingGroup && (!invitedAssessmentGroup || invitingGroup.id !== invitedAssessmentGroup.id)) {
          setInvitedAssessmentGroup(invitingGroup);
          setIsInviteModalOpen(true);
        }
      }

      // 3. Update tracking
      const allIds = data.map(g => g.id);
      knownGroupsRef.current = new Set(allIds);
      isFirstLoad.current = false;

      setGroups(data);

      // 4. Calculate unread
      const lastSeen = JSON.parse(localStorage.getItem('groups_last_seen') || '{}');
      let totalUnread = 0;
      data.forEach(g => {
        const seenCount = lastSeen[g.id] || 0;
        if (g.messageCount > seenCount) {
          totalUnread += 1; // Count how many groups have NEW messages
        }
      });
      setUnreadCount(totalUnread);
    } catch (err) {
      console.error("Polling groups failed:", err);
    }
  };

  const handleGlobalConfirmFinish = async () => {
    if (!invitedAssessmentGroup) return;
    try {
      await assessmentService.finishReading(invitedAssessmentGroup.id);
      setIsInviteModalOpen(false);

      // Redirect to that group
      setActiveTab('groups');
      setSelectedGroupId(invitedAssessmentGroup.id);
    } catch (error) {
      console.error("Global finish failed:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      pollGroups();
      const interval = setInterval(pollGroups, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // If we enter a chat room, mark it as seen
    if (selectedGroupId) {
      const lastSeen = JSON.parse(localStorage.getItem('groups_last_seen') || '{}');
      const group = groups.find(g => g.id === selectedGroupId);
      if (group) {
        lastSeen[selectedGroupId] = group.messageCount;
        localStorage.setItem('groups_last_seen', JSON.stringify(lastSeen));
        pollGroups(); // Recalculate unread immediately
      }
    }
  }, [selectedGroupId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchProfile();
      setView('dashboard');
    } else {
      setIsAuthenticated(false);
      setView('login');
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('dashboard');
    fetchProfile();
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setView('login');
    setCurrentUser(null);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setView('edit-book');
  };

  const handlePageSuccess = () => {
    setView('dashboard');
    // For specific pages, we might want to refresh specific data
  };

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  // Router for Authenticated Views (Dashboard Tabs)
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'explore':
        return <Discover />;
      case 'groups':
        if (selectedGroupId) {
          return <ChatRoom groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />;
        }
        return <Groups onSelectGroup={(id) => setSelectedGroupId(id)} groupsData={groups} />;
      case 'library':
        return (
          <Library
            onUploadClick={() => setView('upload-book')}
            onEditClick={handleEditBook}
          />
        );
      case 'profile':
        return (
          <Profile
            onEditProfile={() => setView('edit-profile')}
            onLogout={handleLogout}
          />
        );
      default:
        return <Discover />;
    }
  };

  // Main UI Router
  const renderView = () => {
    if (!isAuthenticated) {
      switch (view) {
        case 'register':
          return <Register onNavigate={setView} />;
        case 'forgot-password':
          return <ForgotPassword onNavigate={setView} onReset={() => alert('Link reset dikirim!')} />;
        default:
          return <Login onNavigate={handleLoginSuccess} onSecondaryNavigate={setView} />;
      }
    }

    // Authenticated Views (Full Page Overlays)
    switch (view) {
      case 'edit-profile':
        return (
          <EditProfile
            profileData={currentUser}
            onBack={() => setView('dashboard')}
            onSaveSuccess={handlePageSuccess}
          />
        );
      case 'upload-book':
        return (
          <UploadBook
            onBack={() => setView('dashboard')}
            onUploadSuccess={handlePageSuccess}
          />
        );
      case 'edit-book':
        return (
          <EditBook
            bookData={editingBook}
            onBack={() => setView('dashboard')}
            onSaveSuccess={handlePageSuccess}
          />
        );
      case 'dashboard':
      default:
        return (
          <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            user={currentUser}
            isChatOpen={activeTab === 'groups' && !!selectedGroupId}
            unreadGroups={unreadCount}
          >
            <AIAssistant
              isOpen={isAssistantOpen}
              onClose={() => setIsAssistantOpen(false)}
            />
            {renderDashboardContent()}
            <MatchNotification
              isOpen={isMatchModalOpen}
              groupTitle={matchedGroup?.title}
              onClose={() => setIsMatchModalOpen(false)}
              onJoinChat={() => {
                setIsMatchModalOpen(false);
                setActiveTab('groups');
                setSelectedGroupId(matchedGroup.id);
              }}
            />
            <AssesmentBriefing
              isOpen={isInviteModalOpen}
              isInvited={true}
              groupTitle={invitedAssessmentGroup?.title}
              onClose={() => setIsInviteModalOpen(false)}
              onConfirm={handleGlobalConfirmFinish}
            />
          </Layout>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {renderView()}
    </div>
  );
}

export default App;
