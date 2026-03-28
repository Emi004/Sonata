import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Profile from "./pages/Profile.jsx";
import Artist from "./pages/Artist.jsx";

const routes = [
  {
    path: "/",
    Component: App,
  },
  {
    path: "/me",
    Component: Profile,
  },
  {
    path: "/artist",
    Component: Artist,
  }
];

const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export const router = createBrowserRouter(routes, { basename });