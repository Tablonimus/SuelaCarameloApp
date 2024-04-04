import "./voucher.css";
import logovoucher from "/logovoucher.png";


const Voucher = (props) => {
  const { sponsor } = props;
  return (
    <>
      <main className="vouchers-wrapper">
        <section className="voucher-boxL">
          <article className="voucher-title">
            <h6>
              <span>DES</span>CUENTO
            </h6>
            <p>SuelaApp</p>
          </article>
          <ul className="voucher-info">
            <li>Terminos y Condiciones</li>
            <li className="font-semibold text-zinc-900 text-xl">
            {sponsor.name}
            </li>
            <li>
             {sponsor.terminos}
            </li>
          </ul>
          <ul className="voucher-contact">
            <li>
              <i className="bx bxs-phone"></i>{sponsor.telefono}
            </li>
            <li>
              <i className="bx bx-target-lock"></i>{sponsor.ubi}
            </li>
          </ul>
        </section>

        <section className="voucher-boxR">
          <picture className="voucher-logo">
            <img src={sponsor.logo} alt="" />
          </picture>
          <article className="voucher-discount">
            <span>{sponsor.descuento}</span>
            <div>
              <p>%</p>
              <p>OFF</p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};
export default Voucher;
