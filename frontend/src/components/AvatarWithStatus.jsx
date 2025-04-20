/* eslint-disable react/prop-types */
import Badge from "@mui/joy/Badge";
import Avatar from "@mui/joy/Avatar";

export default function AvatarWithStatus(props) {
  const { online = false, showStatus = true, ...other } = props;

  return (
    <div>
      {showStatus ? (
        <Badge
          color={online ? "success" : "neutral"}
          variant={online ? "solid" : "soft"}
          size="sm"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeInset="4px 4px"
        >
          <Avatar size="sm" {...other} />
        </Badge>
      ) : (
        <Avatar size="sm" {...other} />
      )}
    </div>
  );
}
