import { AiOutlineHome, AiOutlineUser } from "react-icons/ai"
import Logo from '../../../assets/mobile_logo.png'
import { FaRegCircleUser } from "react-icons/fa6"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";

const AdminLayoutPage = () => {
    const navigate = useNavigate();
    const [viewUser, setViewUser] = useState<boolean>(false)
    const [vh, setVh] = useState<number>()
    const [vw, setVw] = useState<number>()
    const {loggedInUser} = useAppContext();

    useEffect(() => {
        setVw(() => window.innerWidth)
        setVh(() => window.innerHeight)
    }, [])

    return (
        <>
            <div style={{ height: `${vh}px`, width: `${vw}px` }} className="flex flex-col p-2">
                <div className="flex items-center justify-center">
                    <div className="flex fixed top-2 left-1/2 -translate-x-1/2 w-[98%] h-[8vh] z-50 items-center justify-between gap-4 px-4 text-green-800 bg-black/20 rounded-xl">
                        <AiOutlineHome onClick={() => navigate('/v1/home')} size={35} />
                        <div className="flex h-[3vh] w-[27vw]" onClick={() => navigate('/admin')}>
                            <img src={Logo} alt="" />
                        </div>
                        <FaRegCircleUser size={35} onClick={() => setViewUser(true)} />
                    </div>
                </div>
                <div className="flex w-full h-[9vh] shrink-0"></div>
                <div className="relative w-full h-full">
                    {/* Outlet area (main content) */}
                    <div
                        className={`w-full h-full transition-opacity duration-300 ${viewUser ? 'pointer-events-none opacity-50' : 'pointer-events-auto opacity-100'
                            }`}
                    >
                        <Outlet />
                    </div>

                    {/* Overlay for viewUser */}
                    {viewUser && (
                        <div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-md p-2"
                            onClick={() => setViewUser(false)}
                        >
                            {/* Stop click from closing when clicking inside the box */}
                            <div
                                className="bg-white text-black p-4 rounded-xl shadow-xl w-[400px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <AiOutlineUser size={45} />
                                    <h2 className="text-xl font-semibold mb-2 header-title">{loggedInUser?.name}</h2>
                                    <h3 className="text-xl font-semibold mb-2 header-title">{loggedInUser?.email}</h3>
                                </div>
                                <div className="flex flex-col w-full gap-1 p-2">
                                    <h3 className="flex w-full header-title text-xl">Logout</h3>
                                    <div className="flex gap-5">
                                        <button
                                            onClick={() => {
                                                localStorage.clear();
                                                navigate('/')
                                            }}
                                            className="mt-3 bg-green-700 text-white px-3 py-1 rounded-lg w-[50%] h-[5vh]">
                                            YES
                                        </button>
                                        <button
                                            onClick={() => setViewUser(false)}
                                            className="mt-3 bg-green-700 text-white px-3 py-1 rounded-lg w-[50%] h-[5vh]"
                                        >
                                            NO
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}

export default AdminLayoutPage