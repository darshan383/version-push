import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

import {
  Avatar,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import FolderIcon from "@mui/icons-material/Folder";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "username",
  });

  const [tabValue, setTabValue] = useState(0);

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );

          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details:", err);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      {/* Tabs */}

      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid #d0d7de",
          borderRadius: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            setTabValue(newValue);

            if (newValue === 1) {
              navigate("/repo");
            }
          }}
          centered
        >
          <Tab
            icon={<MenuBookIcon />}
            iconPosition="start"
            label="Overview"
          />

          <Tab
            icon={<FolderIcon />}
            iconPosition="start"
            label="Starred Repositories"
          />
        </Tabs>
      </Paper>

      {/* Logout */}

      <Button
        variant="contained"
        color="error"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");

          setCurrentUser(null);

          window.location.href = "/auth";
        }}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 40,
          zIndex: 999,
        }}
      >
        Logout
      </Button>

      {/* Profile */}

      <Box
        sx={{
          display: "flex",
          gap: 4,
          p: 4,
        }}
      >
        {/* Left */}

        <Paper
          elevation={2}
          sx={{
            width: 320,
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            height: "fit-content",
          }}
        >
          <Avatar
            src={userDetails.profileImage}
            sx={{
              width: 150,
              height: 150,
              mx: "auto",
              mb: 2,
            }}
          />

          <Typography variant="h5" fontWeight={700}>
            {userDetails.username}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Full Stack Developer
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 3,
              bgcolor: "#2da44e",
              "&:hover": {
                bgcolor: "#218b3a",
              },
            }}
          >
            Follow
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Box>
              <Typography variant="h6">
                10
              </Typography>

              <Typography variant="body2">
                Followers
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6">
                3
              </Typography>

              <Typography variant="body2">
                Following
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Right */}

        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              mb={3}
            >
              Contribution Graph
            </Typography>

            <HeatMapProfile />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Profile;