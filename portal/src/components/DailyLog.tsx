import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Fade,
  Avatar,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Empty, Modal } from "antd";
import {
  DeleteOutlined,
  CalendarOutlined,
  FireOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "../contexts/AuthContext";
import { getLogsByUserId, deleteLog } from "../api/logs";
import type { FoodLog } from "../api/types";

interface DailyLogProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function DailyLog({ onNavigate }: DailyLogProps) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      loadLogs();
    }
  }, [user]);

  const loadLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const allLogs = await getLogsByUserId(user.id);
      setLogs(allLogs.sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (logId: number) => {
    Modal.confirm({
      title: "Delete Food Log",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this meal log?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteLog(logId);
          setLogs(logs.filter((log) => log.id !== logId));
          setSnackbar({
            open: true,
            message: "Log deleted successfully",
            severity: "success",
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message:
              err instanceof Error ? err.message : "Failed to delete log",
            severity: "error",
          });
        }
      },
    });
  };

  const filteredLogs = logs;

  const getMealEmoji = (index: number) => {
    const emojis = ["🍳", "🍱", "🍽️", "🍿"];
    return emojis[index % emojis.length];
  };

  const totalCalories = logs.reduce((total, log) => {
    const logCal =
      log.ingredients?.reduce((sum, ing) => sum + (ing.kcal || 0), 0) || 0;
    return total + logCal;
  }, 0);

  if (loading) {
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
        <Typography color="text.secondary">Loading logs...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          pb: 10,
        }}
      >
        {/* Header */}
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
              <Typography variant="h5" color="white" fontWeight="bold">
                Food Diary
              </Typography>
            </Box>

            {/* Stats Summary */}
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
                    📊
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {logs.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Logs
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography fontSize={32} mb={0.5}>
                    🔥
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {Math.round(totalCalories)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Calories
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography fontSize={32} mb={0.5}>
                    🍽️
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {Math.round(totalCalories / (logs.length || 1))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg/Meal
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>

        <Box p={3}>
          {/* Error Message */}
          {error && (
            <Paper
              elevation={4}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                bgcolor: "#fff3f3",
                border: "1px solid #ffcdd2",
              }}
            >
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {/* Food Logs List */}
          {filteredLogs.length === 0 ? (
            <Paper
              elevation={4}
              sx={{
                p: 6,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                textAlign: "center",
              }}
            >
              <Empty
                description={
                  <Box>
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      No Food Logs Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start tracking your meals by scanning food!
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          ) : (
            <AnimatePresence>
              <Box display="flex" flexDirection="column" gap={2}>
                {filteredLogs.map((log, index) => {
                  const calories =
                    log.ingredients?.reduce(
                      (sum, ing) => sum + (ing.kcal || 0),
                      0
                    ) || 0;

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          borderRadius: 4,
                          overflow: "hidden",
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px)",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                          },
                        }}
                        onClick={() => onNavigate("results", { logId: log.id })}
                      >
                        <Box p={2.5}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  bgcolor: "#667eea",
                                  width: 48,
                                  height: 48,
                                  fontSize: 24,
                                }}
                              >
                                {getMealEmoji(index)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  Meal #{log.id}
                                </Typography>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                >
                                  <CalendarOutlined
                                    style={{ fontSize: 12, color: "#999" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Log ID: {log.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                if (log.id) handleDeleteLog(log.id);
                              }}
                              sx={{
                                color: "white",
                                bgcolor: "#ff4d4f",
                                "&:hover": { bgcolor: "#ff7875" },
                              }}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </Box>

                          <Box
                            display="grid"
                            gridTemplateColumns="repeat(3, 1fr)"
                            gap={1}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)",
                                textAlign: "center",
                              }}
                            >
                              <FireOutlined
                                style={{ fontSize: 20, color: "white" }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="white"
                                mt={0.5}
                              >
                                {Math.round(calories)}
                              </Typography>
                              <Typography variant="caption" color="white">
                                kcal
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                                textAlign: "center",
                              }}
                            >
                              <Typography fontSize={20} color="white">
                                ⚖️
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="white"
                                mt={0.5}
                              >
                                {log.ingredients?.reduce(
                                  (sum, ing) => sum + (ing.weight || 0),
                                  0
                                ) || 0}
                              </Typography>
                              <Typography variant="caption" color="white">
                                grams
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(135deg, #FEB692 0%, #EA5455 100%)",
                                textAlign: "center",
                              }}
                            >
                              <Typography fontSize={20} color="white">
                                🍽️
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="white"
                                mt={0.5}
                              >
                                {log.ingredients?.length || 0}
                              </Typography>
                              <Typography variant="caption" color="white">
                                items
                              </Typography>
                            </Box>
                          </Box>

                          {log.confidence && (
                            <Box mt={2}>
                              <Chip
                                label={`${Math.round(
                                  log.confidence * 100
                                )}% confidence`}
                                size="small"
                                sx={{
                                  bgcolor:
                                    log.confidence >= 0.8
                                      ? "#52c41a"
                                      : "#faad14",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </motion.div>
                  );
                })}
              </Box>
            </AnimatePresence>
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
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

      <BottomNavigation currentScreen="daily-log" onNavigate={onNavigate} />
    </>
  );
}
