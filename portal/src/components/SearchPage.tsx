import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Fade,
  Avatar,
} from "@mui/material";
import { SearchOutlined, PlusOutlined, FireOutlined } from "@ant-design/icons";
import { Empty, Tag } from "antd";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";

interface SearchPageProps {
  onNavigate: (screen: string) => void;
}

interface FoodItem {
  id: string;
  name: string;
  calories: string;
  image: string;
  category: string;
  emoji: string;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Recent");

  const foodItems: FoodItem[] = [
    {
      id: "1",
      name: "Banana",
      calories: "89 kcal",
      image: "https://images.unsplash.com/photo-1605056545073-449ca9a838cb?w=400",
      category: "Recent",
      emoji: "🍌",
    },
    {
      id: "2",
      name: "Grilled Chicken",
      calories: "165 kcal",
      image: "https://images.unsplash.com/photo-1673238114980-47d4e9cc793e?w=400",
      category: "Popular",
      emoji: "🍗",
    },
    {
      id: "3",
      name: "Quinoa Bowl",
      calories: "120 kcal",
      image: "https://images.unsplash.com/photo-1722882270502-4758cbd78661?w=400",
      category: "Popular",
      emoji: "🥗",
    },
    {
      id: "4",
      name: "Mixed Vegetables",
      calories: "35 kcal",
      image: "https://images.unsplash.com/photo-1744659750204-87034350eec6?w=400",
      category: "Popular",
      emoji: "🥦",
    },
    {
      id: "5",
      name: "Salmon Fillet",
      calories: "208 kcal",
      image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400",
      category: "Healthy",
      emoji: "🐟",
    },
    {
      id: "6",
      name: "Avocado Toast",
      calories: "250 kcal",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
      category: "Healthy",
      emoji: "🥑",
    },
  ];

  const filters = ["Recent", "Popular", "Healthy", "Low-Cal"];

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          pb: 10,
        }}
      >
        {/* Header */}
        <Fade in timeout={500}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)',
              p: 3,
              pb: 4,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h5"
              color="white"
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              Search Foods
            </Typography>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search for foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined style={{ fontSize: 20, color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Box>
        </Fade>

        <Box p={3}>
          {/* Filter Chips */}
          <Box display="flex" gap={1} mb={3} sx={{ overflowX: 'auto', pb: 1 }}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => setActiveFilter(filter)}
                sx={{
                  bgcolor: activeFilter === filter
                    ? 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                  color: activeFilter === filter ? 'white' : 'text.primary',
                  fontWeight: 'bold',
                  px: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: activeFilter === filter
                      ? 'linear-gradient(135deg, #ff6a00 0%, #ff9a56 100%)'
                      : 'rgba(255, 255, 255, 1)',
                  },
                  background: activeFilter === filter
                    ? 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                }}
              />
            ))}
          </Box>

          {/* Food Items */}
          {filteredItems.length === 0 ? (
            <Paper
              elevation={4}
              sx={{
                p: 6,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                textAlign: 'center',
              }}
            >
              <Empty
                description={
                  <Typography color="text.secondary">
                    No foods found. Try a different search or filter.
                  </Typography>
                }
              />
            </Paper>
          ) : (
            <AnimatePresence>
              <Box display="flex" flexDirection="column" gap={2}>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box display="flex" p={2} gap={2}>
                        <Avatar
                          src={item.image}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 3,
                            border: '3px solid white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                        >
                          {item.emoji}
                        </Avatar>

                        <Box flex={1}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="start"
                            mb={1}
                          >
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {item.name}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                <FireOutlined style={{ fontSize: 16, color: '#ff6a00' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {item.calories} per 100g
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Tag
                              color={
                                item.category === "Healthy"
                                  ? "green"
                                  : item.category === "Popular"
                                  ? "orange"
                                  : "blue"
                              }
                            >
                              {item.category}
                            </Tag>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 2,
                                  background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'white',
                                }}
                              >
                                <PlusOutlined />
                              </Box>
                            </motion.div>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </AnimatePresence>
          )}
        </Box>
      </Box>

      <BottomNavigation currentScreen="search" onNavigate={onNavigate} />
    </>
  );
}
