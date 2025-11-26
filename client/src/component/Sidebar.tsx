import { AiOutlineCloseCircle, AiOutlineRight, AiOutlineUser } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { MdDashboard } from "react-icons/md"
import { useState } from "react"

const Sidebar = () => {
    const { setMenuClick, loggedInUser, setLoggedInUser } = useAppContext()
    const [viewUser, setViewUser] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleRouting = () => {
        if (loggedInUser?.role === 'admin') {
            navigate('/admin')
        } else {
            navigate('/seller')
        }
    }

    return (
        <>
            <div className="flex flex-col w-full gap-3 justify-center">
                <ul className="flex justify-between h-[6vh] items-center text-2xl md:text-4xl p-2 font-semibold header-title">
                    <div className={`${loggedInUser && 'hidden'}`}>
                        <li className="flex gap-4 items-center justify-center" onClick={() => {
                            navigate('/auth/login')
                        }}>
                            <FaUserCircle size={33} />Login / Register
                        </li>
                    </div>
                    {(loggedInUser?.role !== 'customer' && loggedInUser !== null) &&
                        <div onClick={handleRouting} className={`${loggedInUser?.role === 'admin' && 'visible flex gap-2 items-center'}`}>
                            <MdDashboard size={45} /> DASHBOARD
                        </div>
                    }
                    {(loggedInUser?.role === 'customer') &&
                        <h1 className="flex w-full h-[7vh] items-center p-2" onClick={() => {
                            setViewUser(true)
                        }}>Profile</h1>
                    }
                    <li><AiOutlineCloseCircle size={45} onClick={() => setMenuClick(false)} /></li>
                </ul>
                <span className="flex grow border border-t border-rose-50"></span>
                <ul className="flex w-full flex-col p-2 gap-6 px-4 text-xl md:text-3xl">
                    <li className="flex justify-between items-center">
                        Trending
                        <AiOutlineRight />
                    </li>
                    <li className="flex justify-between items-center">New Arrival</li>
                    <li className="flex justify-between items-center">
                        Women
                        <AiOutlineRight />
                    </li>
                    <li className="flex justify-between items-center">
                        Men
                        <AiOutlineRight />
                    </li>
                    <li className="flex justify-between items-center">
                        Accessories
                        <AiOutlineRight />
                    </li>
                    <li className="flex justify-between items-center">
                        Sale
                        <AiOutlineRight />
                    </li>
                </ul>
                <ul className="flex flex-col gap-2 p-2 px-6 md:text-2xl">
                    <li className="flex items-center">
                        Customer Service
                    </li>
                    <li className="flex items-center">
                        FAQ
                    </li>
                    <li className="flex items-center">
                        Contact Us
                    </li>
                    <li className="flex items-center">
                        Sizing Guide
                    </li>
                </ul>
            </div>

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
                                        navigate('/v1/home')
                                        localStorage.clear();
                                        setLoggedInUser(null)
                                    }}
                                    className="mt-[3vh] bg-green-700 text-white px-3 py-1 rounded-lg w-[50%] h-[5vh]">
                                    YES
                                </button>
                                <button
                                    onClick={() => setViewUser(false)}
                                    className="mt-[3vh] bg-green-700 text-white px-3 py-1 rounded-lg w-[50%] h-[5vh]"
                                >
                                    NO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar