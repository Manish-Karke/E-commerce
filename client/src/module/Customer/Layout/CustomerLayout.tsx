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
            <div style={{width: `${vw}`, height: `${vh}`}} className={`flex flex-col overflow-x-clip ${searchClick ? "" : "mt-[8vh]"}`}>
                <Outlet/>
            </div>
        </>
    )
}

export default CustomerLayoutPage