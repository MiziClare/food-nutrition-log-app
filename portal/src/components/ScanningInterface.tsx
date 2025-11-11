import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Fade,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import { Modal, Image } from "antd";
import {
  CloseOutlined,
  CameraOutlined,
  UploadOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { uploadFoodImage } from "../api/ai";
import { useAuth } from "../contexts/AuthContext";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface ScanningInterfaceProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function ScanningInterface({ onNavigate }: ScanningInterfaceProps) {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mealTypes = [
    {
      type: "Breakfast" as MealType,
      emoji: "🍳",
      gradient: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)",
    },
    {
      type: "Lunch" as MealType,
      emoji: "🍱",
      gradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
    },
    {
      type: "Dinner" as MealType,
      emoji: "🍽️",
      gradient: "linear-gradient(135deg, #FEB692 0%, #EA5455 100%)",
    },
    {
      type: "Snack" as MealType,
      emoji: "🍿",
      gradient: "linear-gradient(135deg, #FD6E6A 0%, #FFC600 100%)",
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select an image file",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowMealTypeSelector(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMealTypeSelect = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setShowMealTypeSelector(false);
  };

  const handleScan = async () => {
    if (!selectedImage || !user) {
      setSnackbar({
        open: true,
        message: "Please select an image first",
        severity: "error",
      });
      return;
    }

    if (!selectedMealType) {
      setSnackbar({
        open: true,
        message: "Please select a meal type",
        severity: "warning",
      });
      setShowMealTypeSelector(true);
      return;
    }

    setIsScanning(true);

    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const result = await uploadFoodImage(file, user.id);

      if (result.status === "SUCCESS" && result.logId) {
        const mealTypes = JSON.parse(localStorage.getItem("mealTypes") || "{}");
        mealTypes[result.logId] = selectedMealType;
        localStorage.setItem("mealTypes", JSON.stringify(mealTypes));

        setSnackbar({
          open: true,
          message: "Analysis complete!",
          severity: "success",
        });
        onNavigate("results", {
          logId: result.logId,
          mealType: selectedMealType,
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Analysis failed",
          severity: "error",
        });
        setIsScanning(false);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to analyze image. Please try again.",
        severity: "error",
      });
      setIsScanning(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <Fade in timeout={500}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <IconButton
            onClick={() => onNavigate("home")}
            disabled={isScanning}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.2)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            <CloseOutlined />
          </IconButton>
          <Typography variant="h6" color="white" fontWeight="bold">
            Scan Your Food
          </Typography>
          <Box width={40} />
        </Box>
      </Fade>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 3,
        }}
      >
        {selectedImage ? (
          <Fade in>
            <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <Image
                  src={selectedImage}
                  alt="Selected food"
                  style={{
                    width: "100%",
                    borderRadius: 24,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                  }}
                  preview={false}
                />
              </motion.div>

              {selectedMealType && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.95)",
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.02)" },
                      transition: "transform 0.2s",
                    }}
                    onClick={() => setShowMealTypeSelector(true)}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      <Typography fontSize={28}>
                        {
                          mealTypes.find((m) => m.type === selectedMealType)
                            ?.emoji
                        }
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {selectedMealType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (tap to change)
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </Fade>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Box textAlign="center" color="white">
              <CameraOutlined style={{ fontSize: 80, opacity: 0.8 }} />
              <Typography variant="h6" mt={2} sx={{ opacity: 0.9 }}>
                Select a photo of your food
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>

      <Fade in timeout={800}>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            pb: 4,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {!selectedImage && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={handleUploadClick}
                disabled={isScanning}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.35)" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <UploadOutlined style={{ fontSize: 28, color: "white" }} />
              </IconButton>
            </motion.div>
          )}

          {selectedImage && selectedMealType && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={handleScan}
                disabled={isScanning}
                sx={{
                  width: 80,
                  height: 80,
                  background:
                    "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                  boxShadow: "0 8px 24px rgba(79, 172, 254, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)",
                  },
                  "&:disabled": { opacity: 0.6 },
                }}
              >
                {isScanning ? (
                  <CircularProgress size={32} sx={{ color: "white" }} />
                ) : (
                  <CheckOutlined style={{ fontSize: 36, color: "white" }} />
                )}
              </IconButton>
            </motion.div>
          )}
        </Box>
      </Fade>

      <Modal
        open={showMealTypeSelector}
        onCancel={() => setShowMealTypeSelector(false)}
        footer={null}
        centered
        styles={{
          content: {
            borderRadius: 24,
            overflow: "hidden",
            padding: 32,
          },
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          Select Meal Type
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          <AnimatePresence>
            {mealTypes.map((meal, index) => (
              <motion.div
                key={meal.type}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  elevation={4}
                  onClick={() => handleMealTypeSelect(meal.type)}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    cursor: "pointer",
                    textAlign: "center",
                    background: meal.gradient,
                    color: "white",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography fontSize={48} mb={1}>
                    {meal.emoji}
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {meal.type}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Modal>

      <Backdrop
        open={isScanning}
        sx={{
          zIndex: 9999,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box textAlign="center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CircularProgress size={80} sx={{ color: "white" }} />
          </motion.div>
          <Typography
            variant="h6"
            color="white"
            mt={3}
            sx={{
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 },
              },
            }}
          >
            Analyzing Your Food...
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)" mt={1}>
            Please wait while AI identifies ingredients
          </Typography>
        </Box>
      </Backdrop>

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
