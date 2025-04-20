import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import AuthWrapper from "../components/AuthWrapper";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUpThunk } from "../Store/AuthSlice/authSlice";
import FullScreenLoader from "../components/Spinner";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  createFriendListThunk,

} from "../Store/AddFriend/friendSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const authSelector = useSelector((item) => item.auth);
  const navigate = useNavigate();
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {authSelector.loading && <FullScreenLoader />}
      <AuthWrapper>
        <Box
          component="main"
          sx={{
            my: "auto",
            py: 2,
            pb: 5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            maxWidth: "100%",
            mx: "auto",
            borderRadius: "sm",
            "& form": {
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
            [`& .MuiFormLabel-asterisk`]: {
              visibility: "hidden",
            },
          }}
        >
          <Stack sx={{ gap: 4, mb: 2 }}>
            <Stack sx={{ gap: 1 }}>
              <Typography component="h1" level="h3">
                Sign up
              </Typography>
              <Typography level="body-sm">
                Already A User?{" "}
                <Link to={"/SignIn"} level="title-sm">
                  Sign In!
                </Link>
              </Typography>
            </Stack>
          </Stack>
          <Divider
            sx={(theme) => ({
              [theme.getColorSchemeSelector("light")]: {
                color: { xs: "#FFF", md: "text.tertiary" },
              },
            })}
          >
            or
          </Divider>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  email: formElements.email.value,
                  password: formElements.password.value,
                  username: formElements.userName.value,
                };
                const signupThunkResponse = await dispatch(signUpThunk(data));
                if (signUpThunk.fulfilled.match(signupThunkResponse)) {
                  console.log("dfgsdkfmksmdkfmksmdf fsd ks dfk sdfk s")
                  await dispatch(createFriendListThunk());
                  navigate("/");
                }
              }}
            >
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" />
              </FormControl>
              <FormControl required>
                <FormLabel>UserName</FormLabel>
                <Input type="text" name="userName" />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" />
              </FormControl>
              <Stack sx={{ gap: 4, mt: 2 }}>
                <Button type="submit" fullWidth>
                  Sign up
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </AuthWrapper>
    </>
  );
};

export default SignUp;
