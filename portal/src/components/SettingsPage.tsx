import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Slider,
  IconButton,
  Avatar,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grow,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  ArrowLeftOutlined,
  UserOutlined,
  BellOutlined,
  DeleteOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
}

interface UserSettings {
  // Profile Settings
  name: string;
  email: string;
  dailyCalorieGoal: number;

  // Notification Settings
  mealReminders: boolean;

  // Health Goals
  targetWeight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  units: "metric" | "imperial";
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || "",
    email: user?.email || "",
    dailyCalorieGoal: 2000,
    mealReminders: true,
    units: "metric",
    targetWeight: 70,
    activityLevel: "moderate",
  });

  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(`settings_${user?.id}`);
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, [user]);

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`settings_${user?.id}`, JSON.stringify(newSettings));
    setSnackbar({
      open: true,
      message: "Settings saved successfully",
      severity: "success",
    });
  };

  const handleSwitchChange = (key: keyof UserSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleCalorieGoalChange = (_event: Event, value: number | number[]) => {
    const newSettings = { ...settings, dailyCalorieGoal: value as number };
    saveSettings(newSettings);
  };

  const handleTargetWeightChange = (
    _event: Event,
    value: number | number[]
  ) => {
    const newSettings = { ...settings, targetWeight: value as number };
    saveSettings(newSettings);
  };

  const handleProfileUpdate = () => {
    const newSettings = { ...settings, name: editName };
    saveSettings(newSettings);
    setEditProfileDialog(false);
    setSnackbar({
      open: true,
      message: "Profile updated successfully",
      severity: "success",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    localStorage.removeItem(`settings_${user?.id}`);
    logout();
    setSnackbar({
      open: true,
      message: "Account deleted successfully",
      severity: "info",
    });
    setTimeout(() => onNavigate("login"), 1500);
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

  const settingsSections = [
    {
      title: "Profile",
      icon: <UserOutlined />,
      color: "#667eea",
      items: [
        {
          label: "Edit Profile",
          subtitle: settings.name || "Set your name",
          action: () => setEditProfileDialog(true),
          type: "button" as const,
        },
        {
          label: "Daily Calorie Goal",
          subtitle: `${settings.dailyCalorieGoal} kcal`,
          type: "slider" as const,
          value: settings.dailyCalorieGoal,
          min: 1200,
          max: 4000,
          step: 100,
          onChange: handleCalorieGoalChange,
        },
      ],
    },
    {
      title: "Reminders",
      icon: <BellOutlined />,
      color: "#f093fb",
      items: [
        {
          label: "Meal Reminders",
          subtitle: "Get reminded to log meals",
          type: "switch" as const,
          value: settings.mealReminders,
          onChange: () => handleSwitchChange("mealReminders"),
        },
      ],
    },
    {
      title: "Health Goals",
      icon: <HeartOutlined />,
      color: "#ff6b6b",
      items: [
        {
          label: "Units",
          subtitle: `Using ${
            settings.units === "metric" ? "Metric (kg)" : "Imperial (lb)"
          }`,
          type: "select" as const,
          value: settings.units,
          options: [
            { value: "metric", label: "Metric (kg, cm)" },
            { value: "imperial", label: "Imperial (lb, in)" },
          ],
          onChange: (value: string) =>
            saveSettings({ ...settings, units: value as any }),
        },
        {
          label: "Target Weight",
          subtitle: `${settings.targetWeight} ${
            settings.units === "metric" ? "kg" : "lb"
          }`,
          type: "slider" as const,
          value: settings.targetWeight,
          min: 40,
          max: 150,
          step: 1,
          onChange: handleTargetWeightChange,
        },
        {
          label: "Activity Level",
          subtitle: settings.activityLevel
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          type: "select" as const,
          value: settings.activityLevel,
          options: [
            { value: "sedentary", label: "Sedentary" },
            { value: "light", label: "Light Activity" },
            { value: "moderate", label: "Moderate Activity" },
            { value: "active", label: "Active" },
            { value: "very_active", label: "Very Active" },
          ],
          onChange: (value: string) =>
            saveSettings({ ...settings, activityLevel: value as any }),
        },
      ],
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          pb: 10,
        }}
      >
        {/* Header */}
        <Fade in timeout={500}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "sticky",
              top: 0,
              zIndex: 10,
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <IconButton
              onClick={() => onNavigate("profile")}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <ArrowLeftOutlined />
            </IconButton>
            <Typography variant="h6" color="white" fontWeight="bold">
              Settings
            </Typography>
          </Box>
        </Fade>

        {/* Profile Card */}
        <Box p={3}>
          <Grow in timeout={600}>
            <Paper
              elevation={8}
              sx={{
                p: 3,
                borderRadius: 4,
                mb: 3,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "#667eea",
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(settings.name, settings.email)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {settings.name || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {settings.email}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setEditProfileDialog(true)}
                  sx={{
                    bgcolor: "#667eea",
                    color: "white",
                    "&:hover": { bgcolor: "#5568d3" },
                  }}
                >
                  <UserOutlined />
                </IconButton>
              </Box>
            </Paper>
          </Grow>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Box mb={3}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: `${section.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: section.color,
                      fontSize: 20,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>

                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {section.items.map((item, itemIndex) => (
                    <Box key={item.label}>
                      <Box p={2.5}>
                        {item.type === "switch" && (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography variant="body1" fontWeight="600">
                                {item.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.subtitle}
                              </Typography>
                            </Box>
                            <Switch
                              checked={item.value as boolean}
                              onChange={item.onChange}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: section.color,
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: section.color,
                                  },
                              }}
                            />
                          </Box>
                        )}

                        {item.type === "slider" && (
                          <Box>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <Typography variant="body1" fontWeight="600">
                                {item.label}
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                color={section.color}
                              >
                                {item.subtitle}
                              </Typography>
                            </Box>
                            <Slider
                              value={item.value as number}
                              onChange={item.onChange}
                              min={item.min}
                              max={item.max}
                              step={item.step}
                              sx={{
                                color: section.color,
                                "& .MuiSlider-thumb": {
                                  width: 20,
                                  height: 20,
                                },
                              }}
                            />
                          </Box>
                        )}

                        {item.type === "select" && (
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              mb={1.5}
                            >
                              {item.label}
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.value}
                                onChange={(e) =>
                                  item.onChange?.(e.target.value)
                                }
                                sx={{
                                  borderRadius: 2,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: `${section.color}40`,
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: section.color,
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: section.color,
                                    },
                                }}
                              >
                                {item.options?.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        {item.type === "button" && (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ cursor: "pointer" }}
                            onClick={item.action}
                          >
                            <Box>
                              <Typography variant="body1" fontWeight="600">
                                {item.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.subtitle}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              sx={{ color: section.color }}
                            >
                              <UserOutlined />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      {itemIndex < section.items.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Paper>
              </Box>
            </motion.div>
          ))}

          {/* Danger Zone */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: "#ff4b4b20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff4b4b",
                  fontSize: 20,
                }}
              >
                <DeleteOutlined />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Danger Zone
              </Typography>
            </Box>

            <Paper
              elevation={4}
              onClick={() => setDeleteAccountDialog(true)}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                background: "rgba(255, 75, 75, 0.1)",
                border: "2px solid #ff4b4b",
                transition: "all 0.3s",
                "&:hover": {
                  background: "rgba(255, 75, 75, 0.2)",
                  transform: "scale(1.02)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <DeleteOutlined style={{ fontSize: 24, color: "#ff4b4b" }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold" color="#ff4b4b">
                    Delete Account
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Permanently delete your account and all data
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* App Info */}
          <Box mt={4} textAlign="center">
            <Typography variant="caption" color="rgba(255,255,255,0.8)">
              NutriScan v1.0.0
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="rgba(255,255,255,0.6)"
            >
              Made with ❤️ for healthier living
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileDialog}
        onClose={() => setEditProfileDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Edit Profile
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            value={settings.email}
            disabled
            margin="normal"
            helperText="Email cannot be changed"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setEditProfileDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <DeleteOutlined style={{ fontSize: 28, color: "#ff4b4b" }} />
            <Typography variant="h6" fontWeight="bold">
              Delete Account
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete your account?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All your data, including food logs,
            progress, and settings will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteAccountDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Delete Forever
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </>
  );
}
