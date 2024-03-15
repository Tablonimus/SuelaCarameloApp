import "./voucher.css";
import logovoucher from "/logovoucher.png";

const Voucher = () => {
  return (
    <>
      <main className="vouchers-wrapper">
        <section className="voucher-boxL">
          <article className="voucher-title">
            <h6>
              <span>DES</span>CUENTO
            </h6>
            <p>Voucher</p>
          </article>
          <ul className="voucher-info">
            <li>Terminos y Condiciones</li>
            <li>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatibus, velit!
            </li>
            <li>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatibus, velit!
            </li>
          </ul>
          <ul className="voucher-contact">
            <li>
              <i className="bx bxs-phone"></i>+54926165923
            </li>
            <li>
              <i className="bx bx-target-lock"></i>Av.Urquiza 129
            </li>
          </ul>
        </section>

        <section className="voucher-boxR">
          <picture className="voucher-logo">
            <img src={logovoucher} alt="" />
          </picture>
          <article className="voucher-discount">
            <span>50</span>
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
