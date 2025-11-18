import { AiOutlineCloseCircle, AiOutlineRight } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { MdDashboard } from "react-icons/md"

const Sidebar = () => {
    const { setMenuClick, loggedInUser } = useAppContext()
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
                <ul className="flex justify-between h-[6vh] items-center text-2xl p-2 font-semibold header-title">
                    <div className={`${loggedInUser && 'hidden'}`}>
                        <li className="flex gap-4 items-center justify-center" onClick={() => {
                            navigate('/auth/login')
                        }}>
                            <FaUserCircle size={33} />Login / Register
                        </li>
                    </div>
                    {loggedInUser &&
                        <div onClick={handleRouting} className={`${loggedInUser?.role === 'admin' && 'visible flex gap-2 items-center'}`}>
                            <MdDashboard size={45} /> DASHBOARD
                        </div>
                    }
                    <li><AiOutlineCloseCircle size={45} onClick={() => setMenuClick(false)} /></li>
                </ul>
                <span className="flex grow border border-t border-rose-50"></span>
                <ul className="flex w-full flex-col p-2 gap-6 px-4 text-xl">
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
                <ul className="flex flex-col gap-2 p-2 px-6">
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
        </>
    )
}

export default Sidebar