import { Spin } from "antd";
import { useCallback, useEffect, useState } from 'react';
import publicSvc from '../../service/public.service';
import type { ListCategoryDetails, ListProductDetails } from './homepage.validation';
import { FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../component/Header';
import { useAppContext } from "../../context/AppContext";
import SearchPage from "../SearchPage/SearchPage";
import NoProductFound from '../../assets/original-edbc9b1a905204e54ac50ca36215712a.webp'
import Sidebar from "../../component/Sidebar";
import CustomerAddToCartPage from "../Cusomter/CustomerAddToCartPage";


const HomePage = () => {
    const { searchClick, searchValue, menuClick, setMenuClick, loggedInUser } = useAppContext();
    const [listCategoriesDetails, setListCategoriesDetails] = useState<ListCategoryDetails[]>([])
    const [listProductDetails, setListProductDetails] = useState<ListProductDetails[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [addToCartEffect, setAddToCartEffect] = useState<boolean>(false)
    const [cartClicked, setCartClicked] = useState<boolean>(false)
    const navigate = useNavigate();

    const listProducts = useCallback(async (id?: string) => {
        try {
            setIsLoading(true)
            const response = await publicSvc.listProduct(id);
            setListProductDetails(response.data.data);

            const categoryList = await publicSvc.listCategories()
            setListCategoriesDetails(categoryList.data.data)
        } catch (error) {
            console.log("Error listing products")
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleProductId = (id: string) => {
        try {
            navigate(`/v1/product/${id}`)
        } catch (error) {
            console.log("Something is wrong here")
            throw error
        }
    }

    const addToCartClick = (id: string) => {
        try {
            if (!loggedInUser) {
                navigate('/auth/login');
            }
            setCartClicked(true)
        } catch (error) {
            throw error
        }
    }

    const vh = window.innerHeight

    useEffect(() => {
        setMenuClick(false)
        listProducts();
    }, [])

    console.log(listCategoriesDetails)

    return (
        isLoading ? <Spin fullscreen /> :
            <>
                <HeaderComponent />
                <div style={{ height: `${vh}px` }} className={`${menuClick ? "w-full overflow-y-clip pointer-events-none" : ""}`}>
                    {/*Main Content*/}
                    <div className={`flex flex-col`}>
                        <div className={`${searchValue ? 'flex visible transition-all duration-300 h-full w-full items-center justify-center' : "hidden"}`}>
                            <SearchPage />
                        </div>
                        <div className={`${searchValue ? 'hidden' : "transition-all duration-300"}`}>
                            <div className={`
                        flex flex-col w-full h-auto
                        ${searchClick ? "" : "mt-[8vh]"} 
                    `}>
                                <div className="flex w-full h-[30vh] relative items-center justify-center">
                                    <img src="https://cdn.shopify.com/app-store/listing_images/9b9f5ef0a0c2024bfb66ec52f962f4da/promotional_image/CI7ykufjqo0DEAE=.png?height=720&width=1280" alt="banner-img" />
                                    <button className={`flex absolute top-50 left-1/2 -translate-x-1/2 bg-green-900/90 p-2 rounded-xl text-white text-xl`}>Shop Now</button>
                                </div>
                                <div className="flex w-full h-[25vh] items-center justify-center mt-3">
                                    <div className='flex overflow-x-auto scrollbar-hide px-3 mr-2 w-full'>
                                        <div className='flex gap-4 w-full place-items-center '>
                                            {listCategoriesDetails.length > 0 ? (
                                                listCategoriesDetails.map((item) => (
                                                    <div key={item._id} className="flex flex-col rounded-xl shrink-0 p-1 h-[25vh] w-[45vw] text-xl font-semibold border-2 border-gray-500 place-items-center items-center justify-center">
                                                        <div className='flex flex-col items-center justify-center'>
                                                            <img
                                                                src={item.image?.secure_url}
                                                                alt={item.name}
                                                                className="h-[19vh] w-auto rounded-xl object-cover"
                                                            />
                                                        </div>
                                                        <div className='flex w-full items-center justify-center h-[12v]'>{item.name}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <img src={NoProductFound} alt="" />
                                                </div>
                                            )}
                                            <div>
                                                <FaAngleRight size={35} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full px-4 h-auto mt-5">
                                    <div className="flex flex-col">
                                        <h1 className="flex header-title text-xl">
                                            BEST SELLER
                                        </h1>
                                        <div className="flex flex-col w-full mt-4 gap-5">
                                            <div className="flex flex-col w-full gap-2 items-center justify-center overflow-hidden">
                                                {listProductDetails.length > 0 ? (
                                                    listProductDetails.map((item) => (
                                                        <div key={item._id}
                                                            className="flex border-2 w-full rounded-md border-violet-300"
                                                            onClick={() => {
                                                                handleProductId(item._id)
                                                            }}>
                                                            <div className="flex flex-col w-90 h-[45vh] gap-2  rounded-xl border-gray-500 mb-4 bg-gray-200/70 relative">
                                                                <div className="aboslute flex w-full h-full place-items-center items-center justify-center">
                                                                    <img src={item.images[0]?.secure_url} className="rounded-xl w-auto h-full" alt="dress-01" />
                                                                </div>
                                                                <div className="absolute w-full bg-gray-100 flex flex-col gap-2 text-xl px-10 rounded-xl font-semibold text-black h-auto overflow-hidden z-2 p-2">
                                                                    {item.title}
                                                                </div>
                                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-[50vw] items-center justify-center z-2 ">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            addToCartClick(item._id)
                                                                            setAddToCartEffect((prev) => !prev)
                                                                        }}
                                                                        className="flex w-full border-gray-400 bg-orange-400 text-xl rounded-md text-white p-2 font-semibold items-center justify-center transition-all duration-500 h-[6vh] header-title">
                                                                        {addToCartEffect ?
                                                                            <>
                                                                                fl motion
                                                                            </> : "ADD TO CART"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))) : (
                                                    <div>
                                                        <img src={NoProductFound} alt="" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex w-full'>
                                                <span className='flex border border-t grow border-gray-500'></span>
                                            </div>
                                            <div className='flex w-full items-center justify-center mb-6'>
                                                <button className='border-2 border-gray-500 p-2 rounded-xl w-[25vw]'>
                                                    More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div>
                        <div className={`
                        flex items-center justify-center
                    `}>
                            <div className="flex flex-col">
                                <h1 className="flex header-title text-xl">LADIES WEARS</h1>
                                <div className="flex flex-col w-full mt-4 gap-5">
                                    <div className="flex flex-col w-full gap-2 items-center justify-center overflow-hidden">
                                        {listProductDetails.length > 0 ? (
                                            listProductDetails.map((item) => (
                                                <div key={item._id}
                                                    className="flex border-2 w-full rounded-md border-violet-300"
                                                >
                                                    <div className="flex flex-col w-90 h-[45vh] gap-2  rounded-xl border-gray-500 mb-4 bg-gray-200/70 relative">
                                                        <div className="aboslute flex w-full h-full place-items-center items-center justify-center">
                                                            <img src={item.images[0]?.secure_url} className="rounded-xl w-auto h-full" alt="dress-01" />
                                                        </div>
                                                        <div className="absolute w-full bg-gray-100 flex flex-col gap-2 text-xl px-10 rounded-xl font-semibold text-black h-auto overflow-hidden z-2 p-2">
                                                            {item.title}
                                                        </div>
                                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-[50vw] items-center justify-center z-2 ">
                                                            <button className="flex w-full border-gray-400 bg-gray-100 border-2 text-xl rounded-xl p-2 font-semibold items-center justify-center">
                                                                Add To Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))) : (
                                            <div>
                                                <img src={NoProductFound} alt="" />
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex w-full'>
                                        <span className='flex border border-t grow border-gray-500'></span>
                                    </div>
                                    <div className='flex w-full items-center justify-center mb-6'>
                                        <button className='border-2 border-gray-500 p-2 rounded-xl w-[25vw]'>
                                            More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer Content */}
                    < div className={`
                    flex bottom-0 flex-col w-full items-center justify-center gap-2 text-base bg-gray-800 text-gray-500 p-2    
                `} >
                        <ul className="flex flex-col place-items-center gap-2 items-center justify-center">
                            <li>CUSTOMER SERVICE</li>
                            <li>COMPANY</li>
                            <li>CONNECT</li>
                            <li>LEGAL</li>
                        </ul>
                        <ul className="grid grid-cols-2 place-items-center gap-2 w-full items-center justify-center mb-3">
                            <li>Contact Us</li>
                            <li>About Us</li>
                            <li>Blog</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div >
                </div>
                {menuClick && (
                    <div
                        onClick={() => setMenuClick(false)}
                        className="fixed inset-0 bg-black/70 z-2 w-full h-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                    >

                    </div>
                )}
                {menuClick && (
                    <div className="fixed top-1/2 -translate-y-1/2 left-1/2 z-3 -translate-x-1/2 text-justify p-4 pt-10 h-[70vh] w-[95vw] text-white font-bold text-xl title-header bg-black/50">
                        <Sidebar />
                    </div>
                )}

                {cartClicked &&
                    <>
                        <div
                            onClick={() => setCartClicked(false)}
                            className="fixed inset-0 w-full h-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                        >
                        </div>

                        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 z-3 -translate-x-1/2 text-justify p-4 h-[60vh] w-[90vw] font-bold text-xl title-header bg-black/20 rounded-xl">
                            <CustomerAddToCartPage/>
                        </div>
                    </>
                }
            </>
    )
}

export default HomePage