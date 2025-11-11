import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import { Card, Statistic, Empty, Badge } from "antd";
import {
  FireOutlined,
  RightOutlined,
  TrophyOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { FoodLogDetail } from "./FoodLogDetail";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { getLogsByUserId } from "../api/logs";
import type { FoodLog } from "../api/types";

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
}

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { user } = useAuth();
  const [todaysLogs, setTodaysLogs] = useState<FoodLog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    if (user) {
      loadTodaysData();
      loadCalorieGoal();
      loadWeightGoal();
    }
  }, [user]);

  // Reload calorie goal when component becomes visible (e.g., navigating back from settings)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        loadCalorieGoal();
        loadWeightGoal();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const loadCalorieGoal = () => {
    if (!user) return;
    const savedSettings = localStorage.getItem(`settings_${user.id}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCalorieGoal(settings.dailyCalorieGoal || 2000);
    }
  };

  const loadWeightGoal = () => {
    if (!user) return;
    const savedSettings = localStorage.getItem(`settings_${user.id}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTargetWeight(settings.targetWeight || null);
      setWeightUnit(settings.units === "imperial" ? "lb" : "kg");
    }
  };

  const loadTodaysData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const allLogs = await getLogsByUserId(user.id);
      setTodaysLogs(allLogs);
    } catch (err) {
      console.error("Error loading logs:", err);
      setTodaysLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const todaysCalories = todaysLogs.reduce((total, log) => {
    const logCalories =
      log.ingredients?.reduce(
        (sum, ingredient) => sum + (ingredient.kcal || 0),
        0
      ) || 0;
    return total + logCalories;
  }, 0);

  const caloriePercentage = Math.min((todaysCalories / calorieGoal) * 100, 100);

  const todaysMeals = todaysLogs.map((log, index) => {
    const calories =
      log.ingredients?.reduce(
        (sum, ingredient) => sum + (ingredient.kcal || 0),
        0
      ) || 0;

    const defaultTimes = ["8:00 AM", "12:30 PM", "6:00 PM", "9:00 PM"];
    const time = defaultTimes[index % defaultTimes.length];

    const mealTypes = JSON.parse(localStorage.getItem("mealTypes") || "{}");
    const savedMealType = log.id ? mealTypes[log.id] : null;

    const mealNames = ["Breakfast", "Lunch", "Dinner", "Snack"];
    const name = savedMealType || mealNames[index % mealNames.length];

    const mealEmojis: Record<string, string> = {
      Breakfast: "🍳",
      Lunch: "🍱",
      Dinner: "🍽️",
      Snack: "🍿",
    };

    const mealColors: Record<string, string> = {
      Breakfast: "#FF6B6B",
      Lunch: "#4ECDC4",
      Dinner: "#FFD93D",
      Snack: "#95E1D3",
    };

    return {
      logId: log.id,
      name,
      time,
      calories: Math.round(calories),
      image:
        log.imagePath ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      emoji: mealEmojis[name] || "🍽️",
      color: mealColors[name] || "#4CAF50",
    };
  });

  if (selectedLogId !== null) {
    return (
      <FoodLogDetail
        logId={selectedLogId}
        onBack={() => setSelectedLogId(null)}
        onDeleted={() => {
          setSelectedLogId(null);
          loadTodaysData();
        }}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          pb: 10,
        }}
      >
        {/* Header with User Info */}
        <Fade in timeout={800}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              p: 3,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background:
                        "linear-gradient(135deg, #fff 0%, #d4fc79 100%)",
                      color: "#11998e",
                      fontSize: "24px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </Avatar>
                </motion.div>
                <Box>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    Hello, {user?.name || "User"}!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Track your health journey
                  </Typography>
                </Box>
              </Box>

              {/* Target Weight Display */}
              {targetWeight ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginRight: "10px" }}
                >
                  <Badge
                    count={`${targetWeight}${weightUnit}`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#11998e",
                      fontWeight: "bold",
                      fontSize: 11,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <Box
                      onClick={() => onNavigate("settings")}
                      sx={{
                        cursor: "pointer",
                        fontSize: 28,
                        transition: "all 0.3s ease",
                      }}
                    >
                      🎯
                    </Box>
                  </Badge>
                </motion.div>
              ) : (
                <Badge count={todaysMeals.length} color="#f5576c">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrophyOutlined
                      style={{ fontSize: 28, color: "#FFD700" }}
                    />
                  </motion.div>
                </Badge>
              )}
            </Box>
          </Box>
        </Fade>

        <Box p={3} pb={12}>
          {/* Calorie Progress Card */}
          <Grow in timeout={1000}>
            <Box mb={3}>
              <Card
                style={{
                  borderRadius: 24,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    Daily Calories
                  </Typography>
                  <Chip
                    icon={<FireOutlined />}
                    label={`${Math.round(caloriePercentage)}%`}
                    sx={{
                      background:
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <Box display="flex" alignItems="baseline" gap={1} mb={2}>
                  <Statistic
                    value={Math.round(todaysCalories)}
                    suffix={`/ ${calorieGoal}`}
                    valueStyle={{
                      fontSize: 32,
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    kcal
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={caloriePercentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "#f0f0f0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                      background:
                        "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
                    },
                  }}
                />
              </Card>
            </Box>
          </Grow>

          {/* Food Logs Section */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              Food Logs ({todaysMeals.length})
            </Typography>
            <IconButton
              onClick={() => onNavigate("daily-log")}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
              }}
              size="small"
            >
              <RightOutlined />
            </IconButton>
          </Box>

          {loading ? (
            <Card
              style={{ borderRadius: 20, textAlign: "center", padding: 40 }}
            >
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Loading your meals...
              </Typography>
            </Card>
          ) : todaysMeals.length === 0 ? (
            <Fade in>
              <Card
                style={{
                  borderRadius: 24,
                  border: "none",
                  textAlign: "center",
                  padding: 40,
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Empty
                  image={<Box fontSize={64}>🍽️</Box>}
                  description={
                    <Box>
                      <Typography variant="body1" color="text.secondary" mb={1}>
                        No meals logged yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start tracking your nutrition now!
                      </Typography>
                    </Box>
                  }
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      onClick={() => onNavigate("scanning")}
                      sx={{
                        width: 64,
                        height: 64,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                        },
                      }}
                    >
                      <CameraOutlined style={{ fontSize: 28 }} />
                    </IconButton>
                  </motion.div>
                </Empty>
              </Card>
            </Fade>
          ) : (
            <AnimatePresence>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {todaysMeals.map((meal, index) => (
                  <motion.div
                    key={meal.logId || index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      hoverable
                      onClick={() => meal.logId && setSelectedLogId(meal.logId)}
                      style={{
                        borderRadius: 20,
                        border: "none",
                        overflow: "hidden",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <ImageWithFallback
                            src={meal.image}
                            alt={meal.name}
                            className="w-full h-full object-cover"
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "50%",
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            {meal.emoji}
                          </Box>
                        </Box>

                        <Box flex={1}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            gutterBottom
                          >
                            {meal.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.time} • {meal.calories} kcal
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            bgcolor: meal.color + "20",
                            color: meal.color,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            fontWeight: "bold",
                          }}
                        >
                          {meal.calories}
                        </Box>

                        <RightOutlined style={{ color: "#999" }} />
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </AnimatePresence>
          )}
        </Box>
      </Box>

      <BottomNavigation currentScreen="home" onNavigate={onNavigate} />
    </>
  );
}
