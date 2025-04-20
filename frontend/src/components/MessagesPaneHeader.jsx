import Avatar from "@mui/joy/Avatar";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useSelector } from "react-redux";

export default function MessagesPaneHeader() {
  const summery = useSelector((state) => state.messageSummery.summery);
  const usersOnline = useSelector((state) => state.onlineUsers.onlineUsers);

  const isSummeryEmpty =
    !summery ||
    !summery.chatHeader ||
    Object.keys(summery.chatHeader).length === 0;

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      {isSummeryEmpty ? (
        <Typography
          sx={{ fontWeight: "lg", fontSize: "lg", textAlign: "center" }}
        >
          🌈✨ Try sending a message to someone! 💌😊
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={{ xs: 1, md: 2 }}
          sx={{ alignItems: "center" }}
        >
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <Avatar size="lg" src={summery.chatHeader.profilePic} />
          <div>
            {usersOnline.includes(summery.chatHeader._id) && (
              <Typography
                component="h2"
                noWrap
                endDecorator={
                  <Chip
                    variant="outlined"
                    size="sm"
                    color="neutral"
                    sx={{ borderRadius: "sm" }}
                    startDecorator={
                      <CircleIcon sx={{ fontSize: 8 }} color="success" />
                    }
                    slotProps={{ root: { component: "span" } }}
                  >
                    Online
                  </Chip>
                }
                sx={{ fontWeight: "lg", fontSize: "lg" }}
              >
                {summery.chatHeader.username}
              </Typography>
            )}
            <Typography level="body-sm">{summery.chatHeader.email}</Typography>
          </div>
        </Stack>
      )}
    </Stack>
  );
}
