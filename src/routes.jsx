/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { setUser } from "./store/slices/userSlice";
import Main from "./pages/Main/Main";
import Profile from "./pages/Profile/Profile";
import Adv from "./pages//Advert/Advert";
import Auth from "./pages/Auth/Auth";
import Reg from "./pages/Auth/Reg";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Seller from "./components/Seller-profile/Seller";
import NotFound from "./pages/notFound/NotFound";

function AppRoutes() {
  const dispatch = useDispatch();

  const setCurrentUser = (value) => dispatch(setUser(value));
  const isAuth = () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
    return token && user;
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isAuth} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/seller/:id" element={<Seller />} />
      <Route path="/seller/*" element={<NotFound />} />
      <Route path="/adv/:id" element={<Adv />} />
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/reg" element={<Reg />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
