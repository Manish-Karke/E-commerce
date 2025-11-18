import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const HomePageLayout = () => {
    const [vh, setVh] = useState<Number>(0)
    const [vw, setVw] = useState<Number>(0)
    const { menuClick, loggedInUser } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    console.log('Checking frist loggedINuser details', loggedInUser)

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