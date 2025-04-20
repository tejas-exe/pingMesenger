import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import MyMessages from "../components/MyMessages";
import { useDispatch } from "react-redux";
import { getMyFriendListThunk } from "../Store/AddFriend/friendSlice";
import { useEffect } from "react";
import { getMyProfileThunk } from "../Store/AuthSlice/authSlice";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  clearSocket,
  setOnlineUsers,
  setSocket,
} from "../Store/OnlineUser/onlineUserSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const authSelector = useSelector((item) => item.auth.user?._id);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getMyProfileThunk());
      await dispatch(getMyFriendListThunk());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (authSelector) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: authSelector,
        },
      });

      dispatch(setSocket(socket));

      socket.on("emitOnlineUser", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socket.close();
        dispatch(clearSocket());
      };
    }
  }, [authSelector, dispatch]);

  return (
    <Box mt={7}>
      <CssVarsProvider
        defaultMode="dark"
        modeStorageKey={null}
        disableTransitionOnChange
      >
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyMessages />
          </Box>
        </Box>
      </CssVarsProvider>
    </Box>
  );
};

export default HomePage;
