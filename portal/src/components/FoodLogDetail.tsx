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
  ArrowLeftOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { getLogById, deleteLog } from "../api/logs";
import type { FoodLog } from "../api/types";

interface FoodLogDetailProps {
  logId: number;
  onBack: () => void;
  onDeleted?: () => void;
}

export function FoodLogDetail({
  logId,
  onBack,
  onDeleted,
}: FoodLogDetailProps) {
  const [log, setLog] = useState<FoodLog | null>(null);
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
    loadLogDetail();
  }, [logId]);

  const loadLogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLogById(logId);
      console.log("Log detail:", data);
      setLog(data);
    } catch (err) {
      console.error("Error loading log detail:", err);
      setError("Failed to load log details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Delete Food Log",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this log? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteLog(logId);
          setSnackbar({
            open: true,
            message: "Log deleted successfully",
            severity: "success",
          });
          onDeleted?.();
          onBack();
        } catch (err) {
          setSnackbar({
            open: true,
            message: "Failed to delete log",
            severity: "error",
          });
        }
      },
    });
  };

  const totalCalories =
    log?.ingredients?.reduce(
      (sum, ingredient) => sum + (ingredient.kcal || 0),
      0
    ) || 0;

  const totalWeight =
    log?.ingredients?.reduce(
      (sum, ingredient) => sum + (ingredient.weight || 0),
      0
    ) || 0;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "#52c41a";
    if (confidence >= 60) return "#faad14";
    return "#ff4d4f";
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress sx={{ width: 200, mb: 2 }} />
        <Typography color="white">Loading log details...</Typography>
      </Box>
    );
  }

  if (error || !log) {
    return (
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={onBack}
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
            Food Log Details
          </Typography>
        </Box>
        <Empty description={error || "Log not found"} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pb: 4,
      }}
    >
      {/* Header */}
      <Fade in>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={onBack}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                mr: 2,
              }}
            >
              <ArrowLeftOutlined />
            </IconButton>
            <Box>
              <Typography variant="h6" color="white" fontWeight="bold">
                Food Log Details
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                Log ID: {logId}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleDelete}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 59, 48, 0.8)",
              "&:hover": { bgcolor: "rgba(255, 59, 48, 1)" },
            }}
          >
            <DeleteOutlined />
          </IconButton>
        </Box>
      </Fade>

      <Box p={3}>
        <AnimatePresence>
          {/* Food Image */}
          {log.imagePath && (
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
                  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                }}
              >
                <Box
                  component="img"
                  src={log.imagePath}
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

          {/* Summary Card */}
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
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: "#667eea",
                      width: 56,
                      height: 56,
                      fontSize: 32,
                    }}
                  >
                    🍽️
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h5" fontWeight="bold">
                      Nutrition Summary
                    </Typography>
                    {log.confidence && (
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          AI Confidence:
                        </Typography>
                        <Chip
                          label={`${Math.round(log.confidence)}%`}
                          size="small"
                          sx={{
                            bgcolor: getConfidenceColor(log.confidence),
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={2}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <FireOutlined style={{ fontSize: 28, marginBottom: 8 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {Math.round(totalCalories)}
                    </Typography>
                    <Typography variant="caption">Calories</Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" mb={1}>
                      ⚖️
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {Math.round(totalWeight)}g
                    </Typography>
                    <Typography variant="caption">Weight</Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #FEB692 0%, #EA5455 100%)",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" mb={1}>
                      🍴
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {log.ingredients?.length || 0}
                    </Typography>
                    <Typography variant="caption">Items</Typography>
                  </Paper>
                </Box>

                {/* Confidence Progress */}
                {log.confidence && (
                  <Box mt={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        AI Analysis Confidence
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(log.confidence)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={log.confidence}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#f0f0f0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor: getConfidenceColor(log.confidence),
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>

          {/* Ingredients List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                mb: 2,
              }}
            >
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Ingredients ({log.ingredients?.length || 0})
                </Typography>
                {log.ingredients && log.ingredients.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {log.ingredients.map((ingredient, index) => {
                      const emojis = [
                        "🥗",
                        "🍖",
                        "🥔",
                        "🍅",
                        "🧅",
                        "🌽",
                        "🥕",
                        "🥦",
                      ];
                      const emoji = emojis[index % emojis.length];

                      return (
                        <motion.div
                          key={ingredient.id || index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
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
                                  color: "#667eea",
                                  width: 48,
                                  height: 48,
                                  fontSize: 24,
                                }}
                              >
                                {emoji}
                              </Avatar>
                              <Box flex={1}>
                                <Typography
                                  variant="body1"
                                  fontWeight="600"
                                  mb={0.5}
                                >
                                  {ingredient.ingredientName}
                                </Typography>
                                <Box display="flex" gap={2}>
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
                      );
                    })}
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

          {/* Success Message */}
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
              onClick={onBack}
            >
              <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              <Typography variant="h6" fontWeight="bold">
                Analysis Complete
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Tap to go back
              </Typography>
            </Paper>
          </motion.div>
        </AnimatePresence>
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
  );
}
