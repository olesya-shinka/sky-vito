import { useSelector } from "react-redux";
import * as S from "./styles";
import { AdsCommentsSelector } from "../../../store/selectors/adsSelector";
import { useMemo, useState } from "react";
import { newComment } from "../../../api/apiAds";
import FormatTime from "../../time/FormatTime";

function Comments({ modal, handleModal, currentAd, updateComments }) {
  const adComments = useSelector(AdsCommentsSelector);

  //Data of comment
  const [commentData, setCommentData] = useState({
    text: "",
  });

  //Status at the time of request to create an advertisement
  const [requestProcess, setRequestProcess] = useState({
    loading: false,
    error: false,
  });

  //Locking a button
  const buttonDisabled = useMemo(() => {
    if (commentData.text === "") return true;
    return false;
  }, [commentData.text]);

  const handleText = (e) =>
    setCommentData((prev) => ({ ...prev, text: e.target.value }));

  //Creating a comment
  const makeNewComment = () => {
    setRequestProcess({ loading: false, error: false });
    newComment(
      {
        text: commentData.text,
      },
      currentAd.id
    )
      .then(() => {
        setRequestProcess({ loading: false, error: false });
        setCommentData((prev) => ({ ...prev, text: "" }));
        updateComments();
      })

      .catch((error) => {
        setRequestProcess({ loading: false, error: error.message });
      });
  };

  // Disabling comments for unregistered users
  const user = localStorage.getItem("access_token");

  return (
    <S.Wrapper style={{ visibility: modal ? "visible" : "hidden" }}>
      <S.Backdrop onClick={handleModal} />
      <S.Modal__block>
        <S.Modal__content>
          <S.Modal__title>Отзывы о товаре</S.Modal__title>
          <S.Modal__btn_close onClick={handleModal}>
            <S.Modal__btn_close_line></S.Modal__btn_close_line>
          </S.Modal__btn_close>
          <S.Modal__scroll>
            {user ? (
              <>
                <S.Modal__form_newArt onSubmit={(e) => e.preventDefault()}>
                  <S.Form__newArt_block>
                    <label for="text">Добавить отзыв</label>
                    <S.Form__newArt_area
                      placeholder="Введите описание"
                      value={commentData.text}
                      onInput={handleText}
                    ></S.Form__newArt_area>
                  </S.Form__newArt_block>
                  <S.Form__newArt__btn_pub
                    onClick={makeNewComment}
                    disabled={buttonDisabled || requestProcess.loading}
                  >
                    <S.Button_text>
                      {requestProcess.loading ? <S.Loading /> : "Опубликовать"}
                    </S.Button_text>
                  </S.Form__newArt__btn_pub>
                </S.Modal__form_newArt>
              </>
            ) : (
              <></>
            )}

            <S.Modal__Comments>
              <S.Comments__review>
                {adComments?.map((el, i) => (
                  <S.Comment__item element={el} key={i + 1}>
                    <S.Comment__left>
                      <S.Comment__img
                        src={`http://127.0.0.1:8090/${el.author?.avatar}`}
                      ></S.Comment__img>
                    </S.Comment__left>
                    <S.Comment__right>
                      <S.Comment__name>
                        {el.author?.name} &nbsp;
                        <FormatTime date={el.created_on} />
                      </S.Comment__name>
                      <S.Comment__title>Комментарий</S.Comment__title>
                      <S.Comment__text>{el.text}</S.Comment__text>
                    </S.Comment__right>
                  </S.Comment__item>
                ))}
              </S.Comments__review>
            </S.Modal__Comments>
          </S.Modal__scroll>
        </S.Modal__content>
      </S.Modal__block>
    </S.Wrapper>
  );
}

export default Comments;
