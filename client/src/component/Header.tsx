import { IoMdSearch } from "react-icons/io"
import { LuShoppingCart } from "react-icons/lu"
import MobileLogo from '../assets/mobile_logo.png'
import { useEffect, useState } from "react"
import { Input } from "antd"
import { useAppContext } from "../context/AppContext"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

const { Search } = Input;

const HeaderComponent = () => {
    const {searchClick, setSearchClick, searchValue, setSearchValue, setAntdSearchClick, menuClick, setMenuClick, loggedInUser} = useAppContext();
    const [hidden, setHidden] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearchClick = () => {
        setSearchClick(true)
    }

    const handleCartClick = () => {
        navigate('/customer/cart')
    }

    useEffect(() => {
        // use a local variable to track last scroll position so we don't re-register
        // the scroll listener on every render.
        let lastY = 0;
        const handleScroll = () => {
            const currentY = window.scrollY;
            setHidden(currentY > lastY);
            lastY = currentY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/*Header*/}
            <div className={`
                flex fixed top-0 left-0 w-full h-[8vh] z-50 items-center justify-between gap-4 px-4
                transition-transform duration-300
                ${hidden ? "-translate-y-full" : "translate-y-0"}
            `}>
                <AiOutlineMenuUnfold size={35} className={`${menuClick ? "hidden transition-all duration-300" : 'visible transition-all duration-300'}`} onClick={() => setMenuClick(true)}/>
                <AiOutlineMenuFold size={35} className={`${menuClick ? "visible transition-all duration-300" : 'hidden transition-all duration-300'}`} onClick={() => setMenuClick(false)}/>
                <img src={MobileLogo} onClick={() => {
                    if(loggedInUser?.role === 'admin'){
                        navigate('/admin')
                    }
                }} alt="aurora-logo" className='h-[3vh] w-[27vw]' />
                <div className="flex gap-4">
                    <IoMdSearch size={35} onClick={handleSearchClick}
                        className={`
                                ${searchClick ? "hidden" : ""}   
                            `}
                    />
                    <LuShoppingCart size={35}
                        onClick={handleCartClick}
                    />
                </div>
            </div>
            <div className={` mt-[8vh]
                    ${searchClick ? "" : "hidden"} 
                `}>
                <Search 
                    allowClear
                    size="large"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={() => setAntdSearchClick(true)}
                    placeholder="input search default" 
                />
            </div>
        </>
    )
}

export default HeaderComponent