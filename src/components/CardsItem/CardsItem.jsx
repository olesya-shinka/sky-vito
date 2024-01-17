import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as S from "./styles";
import img from "../../assets/images/no_img.png";
import FormatTime from "../time/FormatTime";

function CardsItem({ element }) {
  return (
    <S.CardsItemBox>
      <S.Cards__item
        to={`/adv/${element?.id}`}
        style={{ textDecoration: "none" }}
      >
        <S.Cards__card>
          {element ? (
            <S.Card__image>
              <S.Link>
                {element?.images.length !== 0 ? (
                  <S.Photo
                    src={`http://127.0.0.1:8090/${element?.images[0]?.url}`}
                  />
                ) : (
                  <S.Photo src={img} />
                )}
              </S.Link>
            </S.Card__image>
          ) : (
            <Skeleton width={270} height={270} duration={10000} />
          )}

          <S.Card__content>
            <S.Link>
              {element ? (
                <S.Card__title>{element?.title}</S.Card__title>
              ) : (
                <Skeleton width={100} height={20} duration={10000}/>
              )}
            </S.Link>
            {element ? (
              <S.Card__price>{element?.price} ₽</S.Card__price>
            ) : (
              <Skeleton width={100} height={20} duration={10000}/>
            )}
            {element ? (
              <S.Card__place>{element?.user?.city}</S.Card__place>
            ) : (
              <Skeleton width={100} height={20} duration={10000}/>
            )}
            <S.Card__date>
              {element ? (
                <FormatTime date={element?.created_on} />
              ) : (
                <Skeleton width={200} height={20} duration={10000}/>
              )}
            </S.Card__date>
          </S.Card__content>
        </S.Cards__card>
      </S.Cards__item>
    </S.CardsItemBox>
  );
}

export default CardsItem;
