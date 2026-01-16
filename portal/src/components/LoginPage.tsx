import { useState } from "react";
import { Form, Input, Button as AntButton, Alert as AntAlert } from "antd";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { motion } from "motion/react";
import { loginUser } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import type { LoginRequest } from "../api/types";

interface LoginPageProps {
  onNavigate: (screen: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const userData = await loginUser(formData);
      login(userData);
      onNavigate("home");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "登录失败，请检查您的邮箱和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-100px",
          right: "-100px",
          filter: "blur(60px)",
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          bottom: "-80px",
          left: "-80px",
          filter: "blur(50px)",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 6,
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
            p: 5,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo Section */}
          <Zoom in timeout={1000}>
            <Box textAlign="center" mb={4}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 20px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  🥗
                </Box>
              </motion.div>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                NutriScan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your nutrition with AI
              </Typography>
            </Box>
          </Zoom>

          <Form layout="vertical" onFinish={handleSubmit} disabled={isLoading}>
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
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

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                size="large"
                placeholder="Enter your password"
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

            {error && (
              <Fade in>
                <Box mb={2}>
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

            <Form.Item style={{ marginBottom: 16 }}>
              <AntButton
                type="primary"
                htmlType="submit"
                size="large"
                icon={
                  isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <LoginOutlined />
                  )
                }
                loading={isLoading}
                block
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
                }}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </AntButton>
            </Form.Item>
          </Form>

          <Box
            sx={{
              textAlign: "center",
              pt: 2,
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <Typography
                  component="span"
                  onClick={() => !isLoading && onNavigate("register")}
                  sx={{
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  Sign Up Now
                </Typography>
              </motion.span>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
