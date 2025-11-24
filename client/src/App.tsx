import { useState } from 'react';
import { Route, Switch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';

// PowerHaus Academy Pages
import UserDashboard from './pages/UserDashboard';
import Programs from './pages/Programs';
import VideoLibrary from './pages/VideoLibrary';
import PowerHausAdminDashboard from './pages/PowerHausAdminDashboard';
import LogoUpload from './components/LogoUpload';

// Original LMS Pages (kept for compatibility)
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import HandsOnStations from './pages/HandsOnStations';
import StationTest from './pages/StationTest';
import Classes from './pages/Classes';
import OnlineClasses from './pages/OnlineClasses';
import Community from './pages/Community';
import DiscussionDetail from './pages/DiscussionDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Register from './pages/Register';
import DeveloperDashboard from './pages/DeveloperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SpeedGrader from './pages/SpeedGrader';
import { AIAssistant } from './components/AIAssistant';
import { Toaster } from './components/ui/toaster';

function App() {
  const [showAI, setShowAI] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(true);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    },
  });

  // Show AI assistant when user is logged in
  const handleShowAI = () => {
    setShowAI(true);
    setAiMinimized(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-white mb-2">PowerHaus Academy</p>
          <p className="text-gray-400">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save the intended destination for after login
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/' && currentPath !== '/register' && !currentPath.startsWith('/login')) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }

    return (
      <>
        <Switch>
          <Route path="/register" component={Register} />
          <Route component={Login} />
        </Switch>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Layout user={user}>
        <Switch>
          {/* PowerHaus Academy Routes */}
          <Route path="/" component={UserDashboard} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/programs" component={Programs} />
          <Route path="/videos" component={VideoLibrary} />
          <Route path="/powerhaus-admin" component={PowerHausAdminDashboard} />
          <Route path="/branding" component={LogoUpload} />

          {/* Original LMS Routes (for admin/legacy access) */}
          <Route path="/lms" component={Dashboard} />
          <Route path="/developer" component={DeveloperDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/teacher" component={TeacherDashboard} />
          <Route path="/speedgrader" component={SpeedGrader} />
          <Route path="/materials" component={Materials} />
          <Route path="/stations" component={HandsOnStations} />
          <Route path="/stations/:id" component={StationTest} />
          <Route path="/classes" component={Classes} />
          <Route path="/online-classes" component={OnlineClasses} />
          <Route path="/community" component={Community} />
          <Route path="/community/:id" component={DiscussionDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />

          {/* 404 */}
          <Route>
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
              <div className="text-center">
                <h1 className="text-9xl font-bold text-purple-500 mb-4">404</h1>
                <p className="text-2xl text-white mb-8">Page Not Found</p>
                <a href="/" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl inline-block transition-colors">
                  Return Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Layout>

      {/* PowerHaus AI Coach - Available everywhere when logged in */}
      {showAI || !aiMinimized ? (
        <AIAssistant
          onClose={() => setShowAI(false)}
          minimized={aiMinimized}
          onToggleMinimize={() => setAiMinimized(!aiMinimized)}
        />
      ) : (
        <AIAssistant
          minimized={true}
          onToggleMinimize={handleShowAI}
        />
      )}

      <Toaster />
    </>
  );
}

export default App;
