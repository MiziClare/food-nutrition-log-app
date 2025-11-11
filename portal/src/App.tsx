import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { HomeDashboard } from "./components/HomeDashboard";
import { ScanningInterface } from "./components/ScanningInterface";
import { AnalysisResults } from "./components/AnalysisResults";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>("home");
  const [screenData, setScreenData] = useState<any>(null);
  const [homeKey, setHomeKey] = useState(0);
  const [profileKey, setProfileKey] = useState(0);

  const handleNavigate = (screen: string, data?: any) => {
    // Refresh home dashboard when navigating back from settings
    if (screen === "home" && currentScreen === "settings") {
      setHomeKey((prev) => prev + 1);
    }
    // Refresh profile page when navigating back from settings
    if (screen === "profile" && currentScreen === "settings") {
      setProfileKey((prev) => prev + 1);
    }
    setCurrentScreen(screen);
    setScreenData(data);
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 未登录显示登录/注册页面
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
        {currentScreen === "register" ? (
          <RegisterPage onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} />
        )}
      </div>
    );
  }

  // 已登录显示主应用
  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeDashboard key={homeKey} onNavigate={handleNavigate} />;
      case "scan":
        return <ScanningInterface onNavigate={handleNavigate} />;
      case "profile":
        return <ProfilePage key={profileKey} onNavigate={handleNavigate} />;
      case "settings":
        return <SettingsPage onNavigate={handleNavigate} />;
      case "results":
        return (
          <AnalysisResults
            onNavigate={handleNavigate}
            logId={screenData?.logId}
          />
        );
      default:
        return <HomeDashboard key={homeKey} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {renderScreen()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
