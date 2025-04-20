import { useEffect, useState } from "react";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Input } from "@mui/joy";
import List from "@mui/joy/List";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChatListItem from "./ChatListItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { retrieveMessageThunk } from "../Store/MessagesSlice/messageSlice";

export default function ChatsPane() {
  const friendListSelector = useSelector((state) => state.friendList);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const socket = useSelector((state) => state.onlineUsers.socket);
  const dispatch = useDispatch();

  const filteredFriends = friendListSelector.myFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = async (chatData) => {
    await dispatch(retrieveMessageThunk(chatData._id));
    setSelectedChatId(chatData._id);
  };

  useEffect(() => {
    const handleGetMessageEvent = async (e) => {
      if (selectedChatId) {
        console.log(">>>>>>>>>", e);
        await dispatch(retrieveMessageThunk(selectedChatId));
      }
    };

    socket?.on("getMessageEvent", handleGetMessageEvent);

    return () => {
      socket?.off("getMessageEvent", handleGetMessageEvent);
    };
  }, [socket, selectedChatId, dispatch]);

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: {
          xs: "calc(100dvh - var(--Header-height))",
          md: "calc(80dvh - 60px)",
        },
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "md", md: "lg" },
            fontWeight: "lg",
            mr: "auto",
          }}
        >
          Messages
        </Typography>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {filteredFriends.length > 0 ? (
          filteredFriends.map((chat, index) => (
            <ChatListItem
              key={index}
              chatData={chat}
              selected={chat._id === selectedChatId}
              onClick={handleChatClick}
            />
          ))
        ) : (
          <Typography sx={{ px: 2, py: 1 }}>
            No friends found, try adding {`:)`}
          </Typography>
        )}
      </List>
    </Sheet>
  );
}
