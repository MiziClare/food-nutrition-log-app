import { Box, Paper, Typography, Fab, Zoom } from "@mui/material";
import { HomeOutlined, UserOutlined, CameraOutlined } from "@ant-design/icons";
import { motion } from "motion/react";

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({
  currentScreen,
  onNavigate,
}: BottomNavigationProps) {
  const navItems = [
    {
      id: "home",
      icon: HomeOutlined,
      label: "Home",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      id: "camera",
      icon: CameraOutlined,
      label: "Scan",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "profile",
      icon: UserOutlined,
      label: "Profile",
      gradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "500px",
        zIndex: 1000,
        pb: 2,
        px: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          borderRadius: "32px",
          overflow: "visible",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            px: 2,
            py: 1,
            position: "relative",
          }}
        >
          {navItems.map((item, index) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            // Center camera button with special styling
            if (item.id === "camera") {
              return (
                <Zoom key={item.id} in timeout={300}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: -2.5,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Fab
                        onClick={() => onNavigate("scan")}
                        sx={{
                          width: 56,
                          height: 56,
                          background: item.gradient,
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                          border: "3px solid white",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            boxShadow: "0 12px 32px rgba(102, 126, 234, 0.6)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <Icon style={{ fontSize: 26, color: "white" }} />
                      </Fab>
                    </motion.div>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        fontSize: "10px",
                        color: "#667eea",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                </Zoom>
              );
            }

            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => onNavigate(item.id)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: isActive ? "transparent" : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      height: 42,
                      borderRadius: "14px",
                      background: isActive ? item.gradient : "transparent",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                        : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: "absolute",
                          inset: -2,
                          borderRadius: "16px",
                          background: item.gradient,
                          opacity: 0.2,
                          filter: "blur(8px)",
                        }}
                      />
                    )}
                    <Icon
                      style={{
                        fontSize: 22,
                        color: isActive ? "white" : "#9E9E9E",
                        transition: "all 0.3s",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "10px",
                      color: isActive ? "text.primary" : "text.secondary",
                      transition: "all 0.3s",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
