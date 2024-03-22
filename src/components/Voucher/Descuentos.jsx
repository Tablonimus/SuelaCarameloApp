import Voucher from "./Voucher";
import Sidebar from "../NavBar/Sidebar";
const Descuentos = () => {

    return(
        <>
        <Sidebar />
        <section className="w-full h-auto py-10 flex flex-col justify-center items-center lg:pb-20">
            <Voucher></Voucher>
            <Voucher></Voucher>
            <Voucher></Voucher>
            <Voucher></Voucher>
        </section>
        </>
    )
}
export default Descuentos;