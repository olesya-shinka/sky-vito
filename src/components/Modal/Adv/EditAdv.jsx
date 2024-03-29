/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import * as S from "./styles";
import {
  delPhoto,
  getAds,
  patchAd,
  postNewAdPhoto,
} from "../../../api/apiAds";
import { setAdsList, setShouldUpdate } from "../../../store/slices/adsSlice";
import { AdsSelector } from "../../../store/selectors/adsSelector";
import { validatePrice } from "../../../utils/validate";

import { RiDeleteBin7Line } from "react-icons/ri";

function EditAdv({ modal, handleModal, currentAd }) {
  const [images, setImages] = useState([]);
  //Ad details
  const [newAdData, setNewAdData] = useState({
    title: currentAd ? currentAd.title : "",
    description: currentAd ? currentAd.description : "",
    price: currentAd ? currentAd.price : "",
    error: false,
  });
  const ads = useSelector(AdsSelector);

  //State at the time of request when creating an ad
  const [requestProcess, setRequestProcess] = useState({
    loading: false,
    error: false,
  });

  //Locking a button
  const buttonDisabled = useMemo(() => {
    if (
      newAdData.title === "" ||
      newAdData.description === "" ||
      newAdData.price === ""
    )
      return true;

    if (currentAd) {
      if (
        newAdData.title !== currentAd.title ||
        newAdData.description !== currentAd.description ||
        newAdData.price !== currentAd.price
      )
        return false;

      if (
        currentAd?.images?.length !==
        Object.values(images).filter((el) => el !== "").length
      )
        return false;

      for (const el of currentAd.images) {
        if (!Object.values(images).find((item) => item === el.url))
          return false;
      }
    } else {
      if (
        newAdData.title !== "" &&
        newAdData.description !== "" &&
        newAdData.price !== ""
      )
        return false;
    }

    return true;
  }, [
    newAdData.title,
    newAdData.description,
    newAdData.price,
    currentAd,
    images,
  ]);

  const handleTitle = (e) =>
    setNewAdData((prev) => ({ ...prev, title: e.target.value }));
  const handleDescription = (e) =>
    setNewAdData((prev) => ({ ...prev, description: e.target.value }));
  const handlePrice = (e) =>
    setNewAdData((prev) => ({ ...prev, price: Number(e.target.value) }));

  //Creating an ad and adding a photo
  const handleAdPhoto = (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
    } else {
      setImages((prev) => ({ ...prev, [event.target.id]: selectedFile }));
    }
  };

  const getImgSrc = (key) => {
    if (images[key]) {
      if (typeof images[key] === "string")
        return `http://127.0.0.1:8090/${images[key]}`;
      else return URL.createObjectURL(images[key]);
    }
    return " ";
  };

  useEffect(() => {
    if (currentAd?.id) {
      const imgObject = {};
      currentAd.images.forEach((img, index) => {
        const key = `fileupload${index + 1}`;
        imgObject[key] = img.url;
      });

      setImages(imgObject);
    } else setImages({});
  }, [currentAd?.id]);

  //Editing an ad

  const dispatch = useDispatch();
  const setAds = (value) => dispatch(setAdsList(value || []));

  const changeAd = async () => {
    if (!validatePrice(newAdData.price)) {
      setNewAdData((prev) => ({
        ...prev,
        error: "Здесь должны быть только цифры",
      }));
      return;
    }

    try {
      await patchAd(
        {
          title: newAdData.title,
          description: newAdData.description,
          price: newAdData.price,
          error: false,
        },
        currentAd.id
      );

      const addArray = [];
      const delArray = [];

      Object.values(images).forEach((el) => {
        if (!currentAd?.images?.find((item) => item.url === el))
          addArray.push(el);
      });
      const requests = [];
      currentAd?.images?.forEach((el) => {
        if (!Object.values(images).find((item) => item === el.url))
          delArray.push(el.url);
      });

      addArray.forEach((el) => {
        const formData = new FormData();
        formData.append("file", el);
        requests.push(() => postNewAdPhoto(formData, currentAd.id));
      });

      await Promise.all(requests.map((request) => request()));

      setRequestProcess({ loading: false, error: false });
      await getAds().then((data) => {
        setAds(data);
      });
      dispatch(setShouldUpdate(true));
      handleModal();
    } catch (error) {
      setRequestProcess({ loading: false, error: error.message });
    }
  };

  const handleDeletePhoto = async (index) => {
    try {
      const result = await delPhoto(currentAd.id, currentAd.images[index].url);
      const adsIndex = ads.findIndex((ad) => ad.id === currentAd.id);
      const newAds = cloneDeep(ads);
      newAds[adsIndex] = result;
      const imgObject = {};
      result.images.forEach((img, index) => {
        const key = `fileupload${index + 1}`;
        imgObject[key] = img.url;
      });
      setImages(imgObject);
    } catch (error) {
      setImages({ error: "Не удалось выполнить действие с изображением" });
    }
  };

  return (
    <S.Wrapper style={{ visibility: modal ? "visible" : "hidden" }}>
      <S.Backdrop onClick={handleModal} />
      <S.Modal__block>
        <S.Modal__content>
          <S.Modal__title>
            {currentAd ? "Редактировать объявление" : "Новое объявление"}
          </S.Modal__title>
          <S.Modal__btn_close onClick={handleModal}>
            <S.Modal__btn_close_line></S.Modal__btn_close_line>
          </S.Modal__btn_close>
          <S.Modal__form_newArt onSubmit={(e) => e.preventDefault()}>
            <S.Form__newArt_block>
              <label htmlFor="text">Название</label>
              <S.Form__newArt_input
                placeholder="Введите название"
                value={newAdData.title}
                onInput={handleTitle}
              ></S.Form__newArt_input>
            </S.Form__newArt_block>
            <S.Form__newArt_block>
              <label htmlFor="text">Описание</label>
              <S.Form__newArt_area
                placeholder="Введите описание"
                value={newAdData.description}
                onInput={handleDescription}
              ></S.Form__newArt_area>
            </S.Form__newArt_block>
            <S.Form__newArt_block>
              <S.Form__newArt_p>
                Фотографии товара<span>не более 5 фотографий</span>
              </S.Form__newArt_p>
              <S.Form__newArt_bar_img>
                <S.Form__newArt_img htmlFor="fileupload1">
                  <S.Form__newArt_img_cover>
                    <img src={getImgSrc("fileupload1")} alt="" />
                  </S.Form__newArt_img_cover>

                  <S.inputChange
                    id="fileupload1"
                    name="photo"
                    type="file"
                    placeholder=""
                    onChange={handleAdPhoto}
                  />
                </S.Form__newArt_img>
                <RiDeleteBin7Line
                  onClick={() => handleDeletePhoto(0)}
                  style={{ cursor: "pointer" }}
                />

                <S.Form__newArt_img htmlFor="fileupload2">
                  <S.Form__newArt_img_cover>
                    <img src={getImgSrc("fileupload2")} alt="" />
                  </S.Form__newArt_img_cover>
                  <S.inputChange
                    id="fileupload2"
                    name="photo"
                    type="file"
                    placeholder=""
                    onChange={handleAdPhoto}
                  />
                </S.Form__newArt_img>
                <RiDeleteBin7Line
                  onClick={() => handleDeletePhoto(1)}
                  style={{ cursor: "pointer" }}
                />

                <S.Form__newArt_img htmlFor="fileupload3">
                  <S.Form__newArt_img_cover>
                    <img src={getImgSrc("fileupload3")} alt="" />
                  </S.Form__newArt_img_cover>
                  <S.inputChange
                    id="fileupload3"
                    name="photo"
                    type="file"
                    placeholder=""
                    onChange={handleAdPhoto}
                  />
                </S.Form__newArt_img>
                <RiDeleteBin7Line
                  onClick={() => handleDeletePhoto(2)}
                  style={{ cursor: "pointer" }}
                />

                <S.Form__newArt_img htmlFor="fileupload4">
                  <S.Form__newArt_img_cover>
                    <img src={getImgSrc("fileupload4")} alt="" />
                  </S.Form__newArt_img_cover>
                  <S.inputChange
                    id="fileupload4"
                    name="photo"
                    type="file"
                    placeholder=""
                    onChange={handleAdPhoto}
                  />
                </S.Form__newArt_img>
                <RiDeleteBin7Line
                  onClick={() => handleDeletePhoto(3)}
                  style={{ cursor: "pointer" }}
                />

                <S.Form__newArt_img htmlFor="fileupload5">
                  <S.Form__newArt_img_cover>
                    <img src={getImgSrc("fileupload5")} alt="" />
                  </S.Form__newArt_img_cover>
                  <S.inputChange
                    id="fileupload5"
                    name="photo"
                    type="file"
                    placeholder=""
                    onChange={handleAdPhoto}
                  />
                </S.Form__newArt_img>
                <RiDeleteBin7Line
                  onClick={() => handleDeletePhoto(4)}
                  style={{ cursor: "pointer" }}
                />
              </S.Form__newArt_bar_img>
            </S.Form__newArt_block>
            <S.Form__newArt_block>
              <label htmlFor="price">Цена</label>
              <S.Form__newArt_input_price
                placeholder="₽"
                value={newAdData.price}
                onInput={handlePrice}
                type="number"
              ></S.Form__newArt_input_price>
              <S.Form__newArt_input_price_cover></S.Form__newArt_input_price_cover>
              <p style={{ color: "red" }}>
                {newAdData.error ? newAdData.error : ""}
              </p>
            </S.Form__newArt_block>
            <S.Form__newArt__btn_pub
              onClick={currentAd ? changeAd : changeAd}
              disabled={buttonDisabled || requestProcess.loading}
            >
              <S.Button_text>
                {requestProcess.loading ? (
                  <S.Loading />
                ) : currentAd ? (
                  "Cохранить"
                ) : (
                  "Опубликовать"
                )}
              </S.Button_text>
            </S.Form__newArt__btn_pub>
          </S.Modal__form_newArt>
        </S.Modal__content>
      </S.Modal__block>
    </S.Wrapper>
  );
}

export default EditAdv;
