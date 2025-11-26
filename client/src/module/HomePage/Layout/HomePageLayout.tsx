import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const HomePageLayout = () => {
    const [vh, setVh] = useState<Number>(0)
    const [vw, setVw] = useState<Number>(0)
    const { menuClick } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)

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
                <div style={{height: `${window.innerHeight}`, width: `${window.innerWidth}`}} className={`flex flex-col items-center justify-center overflow-x-clip ${menuClick && ""}`}>
                    <Outlet/>
                </div>
            }
        </>
    )
}

export default HomePageLayout