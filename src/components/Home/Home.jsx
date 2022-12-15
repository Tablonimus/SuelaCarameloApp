import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { Carousel, Spinner } from "flowbite-react";
import suela1 from "../../assets/images/suela1.jpeg";
import suela2 from "../../assets/images/suela2.jpeg";
import suela3 from "../../assets/images/suela3.jpeg";
import FooterComp from "../FooterComp/FooterComp.jsx";
import { Card } from "flowbite-react";
import NavTwo from "../NavBar/NavTwo";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatches, getAllNotices, getAllTeams } from "../../redux/actions";
import Notices from "../Notice/Notices";
import CategoryHome from "../Buttons/CategoryHome";

export default function Home() {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllNotices(categoryState));
    dispatch(getAllTeams(categoryState));
    dispatch(getAllMatches(categoryState));
  }, []);

  const allNotices = useSelector((state) => state.allNotices);
  
  const orden = allNotices.sort((a,b)=>{return a-b})
  console.log(orden);
  return (
    <div className=" bg-black justify-between flex flex-col items-center">
      <NavBar />

      <NavTwo />
      <section className="mt-5 h-full">
        {allNotices?.length > 0 ? (
          allNotices.map((notice) => (
            <Notices
              key={notice.id}
              id={notice.id}
              title={notice.title}
              subtitle={notice.subtitle}
              images={notice.images}
              videos={notice.videos}
              content={notice.content}
              category={notice.category}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-5">
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="xl"
            />
            <span className="text-white"> Cargando Noticias</span>
          </div>
        )}
      </section>

      <FooterComp />
    </div>
  );
}
