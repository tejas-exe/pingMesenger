import {
  Drawer,
  DialogTitle,
  TextField,
  Box,
  Avatar,
  IconButton,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux"; // Combined imports
import {
  addFriendToFriendListThunk,
  getFriendListThunk,
  getMyFriendListThunk,
  openCloseModel,
} from "../Store/AddFriend/friendSlice";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { HowToReg } from "@mui/icons-material";

const FriendListDrawer = () => {
  const dispatch = useDispatch();
  const friendListSelector = useSelector((state) => state.friendList);
  const myFriendsId = friendListSelector.myFriends.map((friend) => friend._id);
  const handleFriendListDrawerClose = () => {
    setText("");
    dispatch(openCloseModel());
  };
  const [text, setText] = useState("");
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(getFriendListThunk(text));
    }, 700);
    return () => clearTimeout(timeOut);
  }, [dispatch, text]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Drawer
        anchor="right"
        open={friendListSelector.isFriendListModelOpen}
        onClose={handleFriendListDrawerClose}
        PaperProps={{
          sx: {
            width: isSmall ? "100%" : isMedium ? "75%" : "50%",
            padding: "20px",
            borderRadius: "0 20px 20px 0",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "width 0.3s ease-in-out",
            backgroundColor: "#171A1C",
          },
        }}
      >
        {/* Close Icon */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleFriendListDrawerClose}>
            <CloseIcon style={{ color: "#fff" }} />
          </IconButton>
        </div>

        {/* Title */}
        <DialogTitle
          sx={{ color: "#fff", textAlign: "center", fontSize: "24px" }}
        >
          Add To Chat
        </DialogTitle>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search friends..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            sx={{
              input: { color: "#fff" },
              backgroundColor: "#2C2F33",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#42464D",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7289DA",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {friendListSelector.friendList.map((item) => (
            <Card
              key={item.id}
              sx={{
                backgroundColor: "#2C2F33",
                color: "#fff",
                borderRadius: "10px",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={item.username}
                  src={item.profilePic}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>
                  {item.username}
                </Typography>
                {!myFriendsId.includes(item._id) && (
                  <IconButton
                    sx={{ color: "#fff" }}
                    onClick={async () => {
                      await dispatch(
                        addFriendToFriendListThunk({
                          friendId: item._id,
                        })
                      );
                      await dispatch(getMyFriendListThunk());
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                )}
                {myFriendsId.includes(item._id) && (
                  <IconButton>
                    <HowToReg sx={{ color: "green" }} />{" "}
                  </IconButton>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Drawer>
    </>
  );
};

export default FriendListDrawer;
