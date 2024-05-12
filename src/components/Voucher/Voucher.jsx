import logovoucher from "/logovoucher.png";
/* import "./voucher.css"; */

const Voucher = (props) => {
  const { sponsor } = props;
  return (
    <div className="px-1">
      <main
        id="vouchers-wrapper"
        className="w-full  flex pl-[72px] mt-6 md:w-[800px] lg:w-[950px] lg:mt-12"
      >
        <section
          id="voucher-boxL"
          className=" bg-white w-1/2 py-1 pl-1 sm:py-2 sm:pl-2 lg:py-4 lg:pl-4 rounded-s-xl"
        >
          <article id="voucher-title">
            <h6 className="font-bold text-zinc-800 text-2xl sm:text-4xl lg:text-6xl">
              <span className="text-[#ed7020]">DES</span>CUENTO
            </h6>
            <p className="text-[#ed7020] font-cursive text-xl -mt-5 mr-2 text-end font-semibold sm:text-3xl sm:mr-12 md:mr-28 lg:mr-10 lg:text-4xl">
              SuelaApp
            </p>
          </article>
          <ul id="voucher-info" className="text-zinc-900">
            <li className="mt-1 text-[.7rem] font-medium leading-4 sm:text-[.8rem] lg:text-[1rem] lg:leading-5 lg:pr-3 text-gray-800">
              {sponsor.terminos}
            </li>
          </ul>
          <ul
            id="voucher-contact"
            className="mt-1 text-sm font-medium flex flex-col gap-[2px] sm:mt-2 lg:flex-row lg:justify-center lg:gap-8 lg:text-lg lg:mt-6"
          >
            <li className="flex items-center lg:border-t-2 lg:border-orange-500 lg:py-1 lg:px-2">
              <i className="bx bxs-phone mr-2 "></i>
              {sponsor.telefono}
            </li>
            <li className="flex items-center lg:border-t-2 lg:border-orange-500 lg:py-1 lg:px-2">
              <i className="bx bx-target-lock mr-2"></i>
              {sponsor.ubi}
            </li>
          </ul>
        </section>

        <section
          id="voucher-boxR"
          className="bg-zinc-900 w-1/2 flex flex-col items-center justify-between lg:py-4 rounded-e-xl"
        >
          <picture className="voucher-logo w-[95%] flex justify-center">
            <img
              className="w-full border-y-2 border-[#ed7020] border-b-white mt-2 md:max-w-64 lg:max-w-72"
              src={sponsor.logo}
              alt=""
            />
          </picture>
          <article
            id="voucher-discount"
            className="flex justify-center items-center mb-10 lg:mb-4"
          >
            <span className="text-7xl font-bold text-[#ed7020] lg:text-8xl">
              {sponsor.descuento}
            </span>
            <div className="text-3xl leading-6 font-semibold text-white lg:text-4xl">
              <p>%</p>
              <p>OFF</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
export default Voucher;
