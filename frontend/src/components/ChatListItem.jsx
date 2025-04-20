/* eslint-disable react/prop-types */
import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import AvatarWithStatus from "./AvatarWithStatus";
import { useSelector } from "react-redux";

export default function ChatListItem({ chatData, selected, onClick }) {
  const usersOnline = useSelector((state) => state.onlineUsers.onlineUsers);

  return (
    <>
      <ListItem>
        <ListItemButton
          color={selected ? "primary" : "neutral"}
          sx={{
            flexDirection: "column",
            alignItems: "initial",
            gap: 1,
            backgroundColor: selected ? "rgba(25, 118, 210, 0.1)" : "inherit",
            borderRadius: "8px",
          }}
          onClick={() => {
            onClick(chatData);
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus
              src={chatData.profilePic}
              online={usersOnline.includes(chatData._id)}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{chatData.username}</Typography>
              <Typography level="body-sm">{chatData.email}</Typography>
            </Box>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </>
  );
}
