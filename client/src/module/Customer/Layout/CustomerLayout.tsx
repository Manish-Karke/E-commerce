import { Outlet } from "react-router-dom"
import HeaderComponent from "../../../component/Header"
import { useAppContext } from "../../../context/AppContext";

const CustomerLayoutPage = () => {
    const {searchClick} = useAppContext();
    const vh = window.innerHeight;
    const vw = window.innerWidth
    return (
        <>
            <HeaderComponent/>
            <div style={{width: `${vw}px`, height: `${vh}px`}} className={`flex flex-col ${searchClick ? "" : "mt-[8vh]"}`}>
                <Outlet/>
            </div>
        </>
    )
}

export default CustomerLayoutPage