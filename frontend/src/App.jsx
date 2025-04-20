/* eslint-disable react/prop-types */
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./page/HomePage";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import Header from "./components/Header";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import Cookies from "js-cookie";

const checkAuth = () => {
  const token = Cookies.get("token"); // Assumes token is stored under the 'token' cookie
  return !!token; // Return true if token exists, false otherwise
};
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  if (!isAuthenticated) {
    return <Navigate to="/signIn" />;
  }
  return children;
};
const PublicRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signUp",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/signIn",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
]);
export default function JoyMessagesTemplate() {
  
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}
