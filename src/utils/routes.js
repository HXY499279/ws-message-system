import { Login, UserHome, AdminHome, NotFound } from "../pages/index";


const Routes = [
  {
    path: '/user',
    component: UserHome,
  },
  {
    path: '/admin',
    component: AdminHome,
  },
  {
    path: '/',
    component: Login,
    exact: true
  },
  {
    path: "/*",
    component: NotFound
  },
]

export default Routes
