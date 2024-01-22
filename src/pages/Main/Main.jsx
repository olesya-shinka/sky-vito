/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as S from "./styles";
import { AdsSelector } from "../../store/selectors/adsSelector";
import { setAdsList } from "../../store/slices/adsSlice";
import { getAds } from "../../api/apiAds";

import logo from "../../assets/icons/logo.png";
import CardsItem from "../../components/CardsItem/CardsItem";
import { Wrapper } from "../../components/Wrapper/Wrapper";

function Main() {
  const dispatch = useDispatch();
  const ads = useSelector(AdsSelector);
  const setAds = (value) => dispatch(setAdsList(value || []));
  const [adsFiltered, setAdsFiltered] = useState([]);
  useEffect(() => {
    getAds().then((data) => {
      setAds(data);
      setAdsFiltered(data);
    });
  }, []);

  // search for ads

  const [searchData, setSearchData] = useState("");

  const handleSearchData = (e) => setSearchData(e.target.value);

  const searchAds = () => {
    if (!searchData) {
      setAdsFiltered(ads);
      return;
    }
    const tmp = ads.filter((el) => {
      if (el.title.toLowerCase().includes(searchData.toLowerCase()))
        return true;
      else return false;
    });
    setAdsFiltered(tmp);
  };

  const ref = useRef(null);

  const onClear = () => {
    setSearchData("");
    setAdsFiltered(ads);
  };

  const { error } = useState(false);
  if (error) {
    return (
      <h3>
        Не удалось загрузить oбъявления, попробуйте позже
        {JSON.stringify(error.data, null, 2)}
      </h3>
    );
  }

  return (
    <Wrapper>
      <S.Main>
        <S.Main__search>
          <S.Search__logo_link>
            <S.Search__logo_img src={logo} />
          </S.Search__logo_link>
          <S.Search__logo_mob_link>
            <S.Search__logo_mob_img />
          </S.Search__logo_mob_link>
          <S.Search__form onSubmit={(e) => e.preventDefault()}>
            <S.Search__text
              ref={ref}
              type="search"
              placeholder="Поиск по объявлениям"
              onInput={handleSearchData}
              value={searchData}
              onClick={() => {
                const element = ref.current;
                element.addEventListener("search", onClear);
                setTimeout(() =>
                  element.removeEventListener("search", onClear)
                );
              }}
            ></S.Search__text>
            <S.Search__text_mob placeholder="Поиск" />
            <S.Search__btn onClick={searchAds}>Найти</S.Search__btn>
          </S.Search__form>
        </S.Main__search>
        <S.Main__container>
          <S.Main__header>Объявления</S.Main__header>
          <SkeletonTheme color="#333" highlightColor="#f2f1f0">
            <S.Main__content>
              <S.Content__cards>
                {adsFiltered?.map((el, i) => (
                  <CardsItem key={i} element={el} />
                ))}
              </S.Content__cards>
            </S.Main__content>
          </SkeletonTheme>
        </S.Main__container>
      </S.Main>
    </Wrapper>
  );
}

export default Main;
