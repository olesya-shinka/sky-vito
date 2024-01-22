/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as S from "./styles";
import CardsItem from "../CardsItem/CardsItem";
import { getAds, getUserById } from "../../api/apiAds";
import img from "../../assets/images/no_img.png";
import { Wrapper } from "../Wrapper/Wrapper";
import logo from "../../assets/icons/logo.png";

function Seller() {
  const navigate = useNavigate();
  const params = useParams();
  const [userAds, setUserAds] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    if (!params.id) {
      navigate("/*");
    }
    getUserById(params.id).then((data) => {
      if (data) {
        setUser(data);
        getAds({ user_id: data.id }).then((userAdsData) => {
          if (userAdsData) {
            setUserAds(userAdsData);
          } else {
            navigate("/*");
          }
        });
      }
    });
  }, []);

  const [showPhone, setShowPhone] = useState(false);
  const handleShowPhone = () => {
    setShowPhone(true);
  };

  return (
    <>
      <S.Main>
        <Wrapper />
        <S.Sellers__container>
          <S.Main__center_block>
            <S.Main__menu>
              <S.Menu__logo_link href="" target="_blank">
                <S.Menu__logo_img src={logo} alt="logo" />
              </S.Menu__logo_link>
              <S.Menu__form>
                <Link to="/">
                  <S.Menu__btn>Вернуться на&nbsp;главную</S.Menu__btn>
                </Link>
              </S.Menu__form>
            </S.Main__menu>
            <S.Main__header>Профиль продавца</S.Main__header>
            <S.Main__profile_sell>
              <S.Profile__sell_content>
                <S.Profile__sell_seller>
                  <S.Seller__left>
                    <S.Seller__img>
                      <S.Link>
                        <S.Photo
                          src={
                            !user?.avatar
                              ? img
                              : `http://127.0.0.1:8090/${user?.avatar}`
                          }
                        />
                      </S.Link>
                    </S.Seller__img>
                  </S.Seller__left>
                  <S.Seller__right>
                    <S.Seller__title>
                      {user?.name} {user?.surname}
                    </S.Seller__title>
                    <S.Seller__city>{user?.city} </S.Seller__city>
                    <S.Seller__inf>
                      Продает товары с {user?.sells_from}
                    </S.Seller__inf>
                    <S.Seller__img_mob_block>
                      <S.Seller__img_mob>
                        <S.Link>
                          <S.Photo />
                        </S.Link>
                      </S.Seller__img_mob>
                    </S.Seller__img_mob_block>

                    <S.Seller__btn onClick={handleShowPhone}>
                      {user?.phone === null ? (
                        <S.Seller__btn_span>
                          Телефон не указан
                        </S.Seller__btn_span>
                      ) : (
                        <S.Seller__btn_span>
                          Показать&nbsp;телефон
                          <br />
                          {!showPhone
                            ? `${user?.phone.substring(
                                0,
                                1
                              )}${user?.phone.substring(1, 4)} XXX XX XX`
                            : user?.phone}
                        </S.Seller__btn_span>
                      )}
                    </S.Seller__btn>
                  </S.Seller__right>
                </S.Profile__sell_seller>
              </S.Profile__sell_content>
            </S.Main__profile_sell>
            <S.Main__title>Товары продавца</S.Main__title>
          </S.Main__center_block>
          <S.Main__content>
            <S.Content__cards>
              {!userAds
                ? "Загрузка"
                : userAds?.map((el, i) => (
                    <CardsItem element={el} key={i + 1} />
                  ))}
            </S.Content__cards>
          </S.Main__content>
        </S.Sellers__container>
      </S.Main>
    </>
  );
}

export default Seller;
