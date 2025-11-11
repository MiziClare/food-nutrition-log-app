import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Chip,
  Fade,
  Grow,
  Snackbar,
  Alert,
} from "@mui/material";
import { Modal } from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  TrophyOutlined,
  FireOutlined,
  CalendarOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "../contexts/AuthContext";
import { getLogsByUserId } from "../api/logs";

interface ProfilePageProps {
  onNavigate: (screen: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, logout } = useAuth();
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const streak = 7;
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadActivityLevel();
    }
  }, [user]);

  const loadActivityLevel = () => {
    if (!user) return;
    const savedSettings = localStorage.getItem(`settings_${user.id}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const level = settings.activityLevel || "moderate";
      // Format activity level for display
      const formatted = level
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      setActivityLevel(formatted);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const logs = await getLogsByUserId(user.id);
      setTotalMeals(logs.length);

      const calories = logs.reduce((total, log) => {
        const logCal =
          log.ingredients?.reduce((sum, ing) => sum + (ing.kcal || 0), 0) || 0;
        return total + logCal;
      }, 0);
      setTotalCalories(Math.round(calories));
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Log Out",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to log out?",
      okText: "Log Out",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        logout();
        setSnackbar({
          open: true,
          message: "Successfully logged out",
          severity: "success",
        });
        onNavigate("login");
      },
    });
  };

  const getInitials = (name?: string, email?: string) => {
    if (name)
      return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    if (email) return email.slice(0, 2).toUpperCase();
    return "U";
  };

  const menuItems = [
    {
      icon: <SettingOutlined />,
      label: "Settings",
      color: "#667eea",
      action: () => onNavigate("settings"),
    },
    {
      icon: <CalendarOutlined />,
      label: "Food Diary",
      color: "#11998e",
      action: () => onNavigate("daily-log"),
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
          pb: 10,
        }}
      >
        {/* Header */}
        <Fade in timeout={500}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              p: 3,
              pb: 8,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" color="white" fontWeight="bold">
                Profile
              </Typography>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": { bgcolor: "rgba(255, 59, 48, 0.8)" },
                }}
              >
                <LogoutOutlined />
              </IconButton>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "white",
                    color: "#11998e",
                    fontSize: 36,
                    fontWeight: "bold",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    mb: 2,
                  }}
                >
                  {getInitials(user?.name, user?.email)}
                </Avatar>
              </motion.div>

              <Typography variant="h5" color="white" fontWeight="bold">
                {user?.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}
              >
                {user?.email}
              </Typography>

              <Box display="flex" gap={1} mt={2}>
                <Chip
                  icon={<TrophyOutlined />}
                  label={`${streak} Day Streak`}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  icon={<FireOutlined />}
                  label={activityLevel}
                  sx={{
                    bgcolor: "rgba(255, 215, 0, 0.3)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Fade>

        <Box p={3} mt={-4}>
          {/* Stats Cards */}
          <Grow in timeout={800}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                mb: 3,
              }}
            >
              <Box
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                p={2}
                gap={2}
              >
                <Box textAlign="center">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)",
                    }}
                  >
                    <Typography fontSize={32} mb={1}>
                      🍽️
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {totalMeals}
                    </Typography>
                    <Typography variant="caption" color="white">
                      Meals
                    </Typography>
                  </Paper>
                </Box>

                <Box textAlign="center">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                    }}
                  >
                    <Typography fontSize={32} mb={1}>
                      🔥
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {totalCalories}
                    </Typography>
                    <Typography variant="caption" color="white">
                      Calories
                    </Typography>
                  </Paper>
                </Box>

                <Box textAlign="center">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #FEB692 0%, #EA5455 100%)",
                    }}
                  >
                    <Typography fontSize={32} mb={1}>
                      📅
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {streak}
                    </Typography>
                    <Typography variant="caption" color="white">
                      Days
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </Grow>

          {/* Menu Items */}
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            color="text.primary"
          >
            Quick Actions
          </Typography>

          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                elevation={2}
                onClick={item.action}
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateX(8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `${item.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="body1" fontWeight="600">
                    {item.label}
                  </Typography>
                </Box>
                <RightOutlined style={{ color: "#999" }} />
              </Paper>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Paper
              elevation={4}
              onClick={handleLogout}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 4,
                cursor: "pointer",
                background: "linear-gradient(135deg, #ff4b4b 0%, #ff6b6b 100%)",
                color: "white",
                textAlign: "center",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 12px 32px rgba(255, 75, 75, 0.3)",
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <LogoutOutlined style={{ fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold">
                  Log Out
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      <BottomNavigation currentScreen="profile" onNavigate={onNavigate} />
    </>
  );
}
