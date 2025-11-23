import { useState } from 'react';
import { Route, Switch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading SPU LMS...</p>
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
          <Route path="/" component={Dashboard} />
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
          <Route>404 - Not Found</Route>
        </Switch>
      </Layout>

      {/* JewelEE AI Assistant - Available everywhere when logged in */}
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
