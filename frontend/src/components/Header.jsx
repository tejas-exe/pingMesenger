import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import {
  Forum,
  LogoutRounded,
  PersonAdd,
  AssignmentInd,
} from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { openCloseModel } from "../Store/AddFriend/friendSlice";
import FriendListDrawer from "./FriendList";
import { useSelector } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const authSelector = useSelector((item) => item.auth);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/signIn";
  };

  return (
    <>
      <Sheet
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          width: "100vw",
          height: "60px",
          padding: "0 20px",
          zIndex: 1300, // Increased zIndex to ensure it's above other elements
          borderBottom: "1px solid",
          borderColor: "neutral.outlinedBorder",
          backgroundColor: "background.level1",
          boxShadow: "sm",
        }}
      >
        <Forum sx={{ display: { xs: "none", sm: "block" } }} />

        {/* Avatar and Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            alt={authSelector?.user?.username}
            src={authSelector?.user?.profilePic}
            onClick={handleMenuOpen}
            sx={{ cursor: "pointer" }}
          />
          <Menu
            sx={{
              zIndex: 1400, // Ensure the menu is above the Drawer
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={logout}>
              <AssignmentInd fontSize="small" sx={{ marginRight: 1 }} />
              {authSelector?.user?.username}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                dispatch(openCloseModel());
              }}
            >
              <PersonAdd fontSize="small" sx={{ marginRight: 1 }} />
              Add Contacts
            </MenuItem>
            <MenuItem onClick={logout}>
              <LogoutRounded fontSize="small" sx={{ marginRight: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Sheet>
      <FriendListDrawer />

      <Outlet />
    </>
  );
}
