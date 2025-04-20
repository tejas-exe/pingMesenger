import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { sendMessageThunk } from "../Store/MessagesSlice/messageSlice";

export default function MessagesPane() {
  const dispatch = useDispatch();
  const summery = useSelector((state) => state.messageSummery.summery);
  const authSelector = useSelector((item) => item.auth.user);

  const isSummeryEmpty =
    !summery ||
    !summery.chatHeader ||
    Object.keys(summery.chatHeader).length === 0;

  const [textAreaValue, setTextAreaValue] = React.useState("");

  return (
    <Sheet
      sx={{
        height: {
          xs: "calc(100dvh - 60px)",
          md: "calc(100dvh - 60px)",
        },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 2,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        {!isSummeryEmpty && (
          <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
            {summery?.messages.map((message, index) => {
              const messageCondition = message.sender._id === authSelector._id;

              const sendersName = messageCondition
                ? "You"
                : message.receiver.username;

              const senderPicture = messageCondition
                ? authSelector.profilePic
                : message.sender.profilePic;

              return (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  sx={{
                    flexDirection: messageCondition ? "row-reverse" : "row",
                  }}
                >
                  <AvatarWithStatus
                    alt={sendersName}
                    src={senderPicture}
                    showStatus={false}
                    sx={{ margin: messageCondition ? "15px" : "0px" }}
                  />
                  <ChatBubble
                    nameHolder={sendersName}
                    message={message.message}
                    isSent={messageCondition}
                  />
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
      {!isSummeryEmpty && (
        <MessageInput
          textAreaValue={textAreaValue}
          setTextAreaValue={setTextAreaValue}
          onSubmit={async () => {
            const payload = {
              receiver: summery.chatHeader._id,
              message: textAreaValue,
            };
            await dispatch(sendMessageThunk(payload));
            setTextAreaValue("");
          }}
        />
      )}
    </Sheet>
  );
}
