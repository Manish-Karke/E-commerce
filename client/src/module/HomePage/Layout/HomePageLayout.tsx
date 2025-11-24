import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const HomePageLayout = () => {
    const [vh, setVh] = useState<Number>(0)
    const [vw, setVw] = useState<Number>(0)
    const { menuClick } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    function setViewportHeight() {
        setVh(window.innerHeight);
    }

    function setViewportWidth() {
        setVw(window.innerWidth)
    }

    useEffect(() => {
        setViewportHeight();
        setViewportWidth();
        setIsLoading(false)
        navigate('home')
    }, [])

    return (
        <>
            {!isLoading &&
                <div style={{ width: `${vw}px`, height: `${vh}px` }} className={`flex flex-col ${menuClick && ""}`}>
                    <Outlet />
                </div>
            }
        </>
    )
}

export default HomePageLayout