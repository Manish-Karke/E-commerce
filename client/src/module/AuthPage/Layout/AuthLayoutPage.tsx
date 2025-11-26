import { useEffect, useState } from "react"
import Logo from '../../../assets/mobile_logo.png'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAppContext } from "../../../context/AppContext"

const AuthLayoutPage = () => {
    const [vh, setVh] = useState<number>()
    const [vw, setVw] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { loginClick, setLoginClick, loggedInUser } = useAppContext()
    const navigate = useNavigate();
    const location = useLocation();
    const isForget = location.pathname.includes('forget')
    const isReset = location.pathname.includes('reset')

    useEffect(() => {
        function setViewPortHeight() {
            let vh = window.innerHeight;
            setVh(vh)
        }
        function setViewportWidth() {
            let vw = window.innerWidth
            setVw(vw)
        }

        setViewPortHeight();
        setViewportWidth();
        setIsLoading(false)

        if (loggedInUser) {
            navigate('/v1/home')
        }
    }, [loggedInUser])

    return (
        isLoading ? "" :
            <>
                <div style={{ width: `${vw}px`, height: `${vh}px` }} className={`flex flex-col  bg-gray-100 gap-2 p-2 items-center justify-center relative`}>
                    <div className="flex w-full h-[10vh] items-center justify-center absolute top-1">
                        <img src={Logo} alt="" className="w-[25vh] h-[5vh] " />
                    </div>
                    <div className="flex bg-gray-300/50 rounded-xl">
                        <div className="flex flex-col w-100 h-120 gap-5 p-2 py-4 md:w-140 md:h-[60vh] md:p-10">
                            <div className="flex flex-col gap-3 md:text-xl">
                                <div className={`flex p-2 justify-center ${isForget && 'hidden' || isReset && 'hidden'}`}>
                                    <button onClick={() => {
                                        navigate('login')
                                        setLoginClick(true)
                                    }} className={`w-47 h-10 md:h-12 p-2 border border-gray-700 ${loginClick ? "border-green-800" : ""}`}>
                                        LOGIN
                                    </button>
                                    <button onClick={() => {
                                        navigate('register')
                                        setLoginClick(false)
                                    }} className={`w-47 h-10 p-2 md:h-12 border border-gray-700 ${loginClick ? "" : "border-green-800"}`}>
                                        REGISTER
                                    </button>
                                </div >
                                <div className={`flex flex-col p-2 justify-center ${!isForget && 'hidden'} gap-10`}>
                                    <h2 className="text-2xl font-bold text-green-950 flex items-center justify-center w-full">
                                        FORGET PASSWORD
                                    </h2>
                                    <div>
                                        <p className="flex text-justify text-xl text-gray-700">
                                            Enter your username or email address below and we'll send you instructions to reset your password
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex flex-col p-2 justify-center ${!isReset && 'hidden'} gap-10`}>
                                    <h2 className="text-2xl font-bold text-green-950 flex items-center justify-center w-full">
                                        RESET YOUR PASSWORD
                                    </h2>
                                    <div>
                                        <p className="flex text-justify text-xl text-gray-700">
                                            Please enter your new password below:
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Outlet />
                                </div>
                                <div className="p-2 flex">
                                    <div className="flex w-full h-[6vh] bg-amber-500 rounded-md shrink-0 p-2 items-center justify-center header-title text-xl text-white">
                                        <button type="button" onClick={() => navigate('/v1/home')}>
                                            HomePage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    )
}

export default AuthLayoutPage