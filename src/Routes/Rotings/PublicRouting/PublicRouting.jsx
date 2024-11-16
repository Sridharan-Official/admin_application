import { lazy } from "react";

const PublicRouting=[
    {
        name: "Login",
        path: "/",
        component: lazy(() => import("../../../Pages/Login/Login")),
      },
      {
        name: "Register",
        path: "/register",
        component: lazy(() => import("../../../Pages/Register/Registration")),
      },
      {
        name: "Page Not Found",
        path: "*",
        component: lazy(() => import("../../../Pages/NotFound/NotFound")),
      }
];

export default PublicRouting;