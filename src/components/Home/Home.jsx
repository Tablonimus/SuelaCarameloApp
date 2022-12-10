import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { Carousel } from "flowbite-react";
import suela1 from "../../assets/images/suela1.jpeg";
import suela2 from "../../assets/images/suela2.jpeg";
import suela3 from "../../assets/images/suela3.jpeg";
import FooterComp from "../FooterComp/FooterComp.jsx";
import { Card } from "flowbite-react";
import NavTwo from "../NavBar/NavTwo";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../../redux/actions";
import Notices from "../Notice/Notices";
import CategoryHome from "../Buttons/CategoryHome";

export default function Home() {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.category);
  console.log(categoryState);
  useEffect(() => {
    dispatch(getAllNotices(categoryState));
  }, []);

  const allNotices = useSelector((state) => state.allNotices);
 

  return (
    <div className=" bg-black justify-between flex flex-col items-center">
      <NavBar />

      <NavTwo />
      <section className="mt-5 h-full">
        {allNotices?.length > 0
          ? allNotices.map((notice) => (
              <Notices
                key={notice.id}
                id={notice.id}
                title={notice.title}
                subtitle={notice.subtitle}
                images={notice.images}
                content={notice.content}
                category={notice.category}
              />
            ))
          : false}
      </section>

      <FooterComp />
    </div>
  );
}
