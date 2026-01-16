import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Fade,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { Empty } from "antd";
import {
  ArrowLeftOutlined,
  FireOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { getLogById } from "../api/logs";
import type { FoodLog } from "../api/types";

interface AnalysisResultsProps {
  onNavigate: (screen: string, data?: any) => void;
  logId?: number;
  mealType?: string;
}

export function AnalysisResults({
  onNavigate,
  logId,
  mealType,
}: AnalysisResultsProps) {
  const [logData, setLogData] = useState<FoodLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (logId) {
      loadLogData();
    } else {
      setError("No log ID provided");
      setIsLoading(false);
    }
  }, [logId]);

  const loadLogData = async () => {
    if (!logId) return;

    try {
      setIsLoading(true);
      const data = await getLogById(logId);
      setLogData(data);
    } catch (err: any) {
      console.error("Failed to load log:", err);
      setError(err.message || "Failed to load analysis results");
    } finally {
      setIsLoading(false);
    }
  };

  const totalCalories =
    logData?.ingredients?.reduce((sum, ing) => sum + ing.kcal, 0) || 0;

  const totalWeight =
    logData?.ingredients?.reduce((sum, ing) => sum + ing.weight, 0) || 0;

  const getMealEmoji = () => {
    const mealEmojis: Record<string, string> = {
      Breakfast: "🍳",
      Lunch: "🍱",
      Dinner: "🍽️",
      Snack: "🍿",
    };
    return mealEmojis[mealType || ""] || "🍽️";
  };

  const getIngredientIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("chicken") || lowerName.includes("鸡")) return "🍗";
    if (lowerName.includes("rice") || lowerName.includes("米")) return "🍚";
    if (lowerName.includes("broccoli") || lowerName.includes("西兰花"))
      return "🥦";
    if (lowerName.includes("pepper") || lowerName.includes("椒")) return "🥡";
    if (lowerName.includes("carrot") || lowerName.includes("胡萝卜"))
      return "🥡";
    if (lowerName.includes("oil") || lowerName.includes("油")) return "🥡";
    if (lowerName.includes("garlic") || lowerName.includes("蒜")) return "🧄";
    if (
      lowerName.includes("onion") ||
      lowerName.includes("葱") ||
      lowerName.includes("洋葱")
    )
      return "🧅";
    if (lowerName.includes("beef") || lowerName.includes("牛肉")) return "🥩";
    if (lowerName.includes("pork") || lowerName.includes("猪肉")) return "🥓";
    if (lowerName.includes("fish") || lowerName.includes("鱼")) return "🐟";
    if (lowerName.includes("egg") || lowerName.includes("蛋")) return "🥚";
    if (lowerName.includes("tomato") || lowerName.includes("番茄")) return "🍅";
    if (lowerName.includes("potato") || lowerName.includes("土豆")) return "🥔";
    if (lowerName.includes("salad") || lowerName.includes("沙拉")) return "🥗";
    if (lowerName.includes("vegetable") || lowerName.includes("蔬菜"))
      return "🥬";
    if (lowerName.includes("mushroom") || lowerName.includes("蘑菇"))
      return "🍄";
    if (lowerName.includes("corn") || lowerName.includes("玉米")) return "🌽";
    if (lowerName.includes("bean") || lowerName.includes("豆")) return "🥡";
    if (lowerName.includes("noodle") || lowerName.includes("面")) return "🍜";
    if (lowerName.includes("bread") || lowerName.includes("面包")) return "🍞";
    if (lowerName.includes("cheese") || lowerName.includes("奶酪")) return "🥡";
    if (lowerName.includes("milk") || lowerName.includes("牛奶")) return "🥛";
    if (lowerName.includes("shrimp") || lowerName.includes("虾")) return "🦐";
    if (lowerName.includes("fruit") || lowerName.includes("水果")) return "🍎";
    return "🥡";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "#52c41a";
    if (confidence >= 60) return "#faad14";
    return "#ff4d4f";
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress sx={{ width: 200, mb: 2 }} />
        <Typography color="text.secondary">
          Loading analysis results...
        </Typography>
      </Box>
    );
  }

  if (error || !logData) {
    return (
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => onNavigate("home")}
            sx={{
              color: "text.primary",
              mr: 2,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ArrowLeftOutlined />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Analysis Results
          </Typography>
        </Box>
        <Empty description={error || "Failed to load results"} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        pb: 4,
      }}
    >
      <Fade in timeout={500}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            pb: 4,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              onClick={() => onNavigate("home")}
              sx={{
                color: "white",
                mr: 2,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <ArrowLeftOutlined />
            </IconButton>
            <Box>
              <Typography variant="h5" color="white" fontWeight="bold">
                Analysis Results
              </Typography>
              {mealType && (
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  {getMealEmoji()} {mealType}
                </Typography>
              )}
            </Box>
          </Box>

          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              p: 2,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Box display="flex" justifyContent="space-around">
              <Box textAlign="center">
                <Typography fontSize={32} mb={0.5}>
                  🔥
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {Math.round(totalCalories)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Calories
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography fontSize={32} mb={0.5}>
                  ⚖️
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {Math.round(totalWeight)}g
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Weight
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography fontSize={32} mb={0.5}>
                  🍽️
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {logData.ingredients?.length || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Items
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>

      <Box p={3}>
        <AnimatePresence>
          {logData.imagePath && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  mb: 3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                }}
              >
                <Box
                  component="img"
                  src={logData.imagePath}
                  alt="Food"
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
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
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Detected Ingredients ({logData.ingredients?.length || 0})
                </Typography>
                {logData.ingredients && logData.ingredients.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {logData.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={ingredient.id || index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            background:
                              "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                            border: "1px solid #e0e0e0",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "translateX(8px)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              sx={{
                                bgcolor: "#667eea20",
                                width: 56,
                                height: 56,
                                fontSize: 32,
                              }}
                            >
                              {getIngredientIcon(ingredient.ingredientName)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography
                                variant="body1"
                                fontWeight="600"
                                mb={0.5}
                              >
                                {ingredient.ingredientName}
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                  label={`${ingredient.weight}g`}
                                  size="small"
                                  sx={{
                                    bgcolor: "#e3f2fd",
                                    color: "#1976d2",
                                    fontWeight: "bold",
                                  }}
                                />
                                <Chip
                                  icon={<FireOutlined />}
                                  label={`${ingredient.kcal} kcal`}
                                  size="small"
                                  sx={{
                                    bgcolor: "#fff3e0",
                                    color: "#f57c00",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No ingredients found"
                  />
                )}
              </Box>
            </Paper>
          </motion.div>

          {logData.confidence && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 4,
                  p: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  mb: 3,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="body1" fontWeight="600">
                    AI Analysis Confidence
                  </Typography>
                  <Chip
                    label={`${Math.round(logData.confidence)}%`}
                    sx={{
                      bgcolor: getConfidenceColor(logData.confidence),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={logData.confidence}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#f0f0f0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: getConfidenceColor(logData.confidence),
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  mt={1}
                  display="block"
                >
                  AI-powered nutrition analysis. Results are estimates based on
                  visual recognition.
                </Typography>
              </Paper>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                p: 3,
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "white",
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                transition: "transform 0.2s",
              }}
              onClick={() => onNavigate("home")}
            >
              <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              <Typography variant="h6" fontWeight="bold">
                Analysis Complete!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Tap to view your food logs
              </Typography>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
