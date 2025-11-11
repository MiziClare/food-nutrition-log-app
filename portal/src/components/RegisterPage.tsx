import { useState } from "react";
import {
  Form,
  Input,
  Button as AntButton,
  Alert as AntAlert,
  Steps,
} from "antd";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "motion/react";
import { registerUser } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import type { RegisterRequest } from "../api/types";

interface RegisterPageProps {
  onNavigate: (screen: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async () => {
    setError("");

    if (!formData.password || formData.password.trim().length === 0) {
      setError("Password is required");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const requestData: RegisterRequest = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      if (formData.name && formData.name.trim()) {
        requestData.name = formData.name.trim();
      }

      const userData = await registerUser(requestData);
      login(userData);
      onNavigate("home");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndNext = () => {
    if (currentStep === 0) {
      if (!formData.email) {
        setError("Please enter your email");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
      setError("");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!formData.password) {
        setError("Please enter a password");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setError("");
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        overflow: "auto",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          top: "-80px",
          left: "-80px",
          filter: "blur(70px)",
        }}
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: "-50px",
          right: "-50px",
          filter: "blur(60px)",
        }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Fade in timeout={800}>
        <Paper
          elevation={24}
          sx={{
            maxWidth: 450,
            width: "100%",
            p: 3,
            my: 2,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo Section */}
          <Zoom in timeout={1000}>
            <Box textAlign="center" mb={2}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto 12px",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    boxShadow: "0 8px 32px rgba(240, 147, 251, 0.5)",
                  }}
                >
                  🎯
                </Box>
              </motion.div>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize={13}>
                Join NutriScan to start your health journey
              </Typography>
            </Box>
          </Zoom>

          {/* Progress Steps */}
          <Box mb={3}>
            <Steps
              current={currentStep}
              size="small"
              items={[
                {
                  title: "Account Info",
                  icon: currentStep > 0 ? <CheckCircleOutlined /> : null,
                },
                {
                  title: "Security",
                  icon: currentStep > 1 ? <CheckCircleOutlined /> : null,
                },
              ]}
            />
          </Box>

          <Form
            layout="vertical"
            onFinish={validateAndNext}
            disabled={isLoading}
          >
            {/* Step 0: Email and Name */}
            {currentStep === 0 && (
              <Slide direction="right" in mountOnEnter unmountOnExit>
                <Box>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>
                        Full Name (Optional)
                      </span>
                    }
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: "#f093fb" }} />}
                      size="large"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Email Address</span>
                    }
                    required
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: "#f093fb" }} />}
                      size="large"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Box>
              </Slide>
            )}

            {/* Step 1: Password */}
            {currentStep === 1 && (
              <Slide direction="left" in mountOnEnter unmountOnExit>
                <Box>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Password</span>}
                    required
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: "#f093fb" }} />}
                      size="large"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Confirm Password</span>
                    }
                    required
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: "#f093fb" }} />}
                      size="large"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        borderRadius: 12,
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Box>
              </Slide>
            )}

            {error && (
              <Fade in>
                <Box mb={1.5}>
                  <AntAlert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError("")}
                    style={{ borderRadius: 12 }}
                  />
                </Box>
              </Fade>
            )}

            <Box display="flex" gap={2}>
              {currentStep > 0 && (
                <AntButton
                  size="large"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                    setError("");
                  }}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Back
                </AntButton>
              )}

              <AntButton
                type="primary"
                htmlType="submit"
                size="large"
                icon={
                  isLoading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : null
                }
                loading={isLoading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(240, 147, 251, 0.4)",
                }}
              >
                {currentStep === 0
                  ? "Continue"
                  : isLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </AntButton>
            </Box>
          </Form>

          <Box
            sx={{
              textAlign: "center",
              pt: 2,
              mt: 2,
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <Typography
                  component="span"
                  onClick={() => !isLoading && onNavigate("login")}
                  sx={{
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  Sign In
                </Typography>
              </motion.span>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
