import { lazy } from "react";

const privateRoute=[
    {
        name: "Dashboard",
        path: "/dashboard",
        component: lazy(() => import("../../../Pages/Dashboard/Dashboard")),
      },
      {
        name: "Add User",
        path: "/adduser",
        component: lazy(() => import("../../../Pages/AddUser/AddUser")),
      },
      // {
      //   name: "Setting",
      //   path: "/setting",
      //   component: lazy(() => import("../../../Pages/Setting/Setting")),
      // },
      {
        name : "Edit",
        path:"/edit/:id",
        component: lazy(()=> import("../../../Pages/AddUser/AddUser"))
      },
      {
        name: "Page Not Found",
        path: "*",
        component: lazy(() => import("../../../Pages/NotFound/NotFound")),
      }
];

export default privateRoute;