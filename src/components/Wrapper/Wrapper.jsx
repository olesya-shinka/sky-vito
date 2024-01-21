import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as S from "./styles";

import { removeUser } from "../../store/slices/userSlice";
import { userSelector } from "../../store/selectors/userSelector";
import { Footer } from "../../components/FooterMobile/styles";
import AdvModal from "../Modal/Adv/AdvModal";

export function Wrapper({ children }) {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal((prev) => !prev);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("updatedToken");
    dispatch(removeUser());
  };

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <S.Header__nav>
            {user.id ? (
              <>
                <S.Header__logo>
                  <S.Logo__mob_link>
                    <S.Logo__mob_img />
                  </S.Logo__mob_link>
                </S.Header__logo>
                <S.Header__btn_putAd onClick={handleModal}>
                  Разместить объявление
                </S.Header__btn_putAd>
                <Link to="/profile">
                  <S.Header__btn_lk>Личный кабинет</S.Header__btn_lk>
                </Link>
                <Link to="/">
                  <S.Header__btn_logout onClick={logout}>
                    Выйти
                  </S.Header__btn_logout>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <S.Header__btn_main_enter>
                  Вход в личный кабинет
                </S.Header__btn_main_enter>
              </Link>
            )}
          </S.Header__nav>
        </S.Header>
        {children}
        <Footer />
      </S.Container>
      {modal && <AdvModal modal={modal} handleModal={handleModal} />}
    </S.Wrapper>
  );
}
