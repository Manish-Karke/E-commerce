import { useCallback, useEffect, useState } from "react"
import publicSvc from "../../service/public.service"
import type { ProductDetailsInterface } from "./product.validation"
import { useNavigate, useParams } from "react-router-dom"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { Rate } from "antd"
import { GoFoldUp, GoPlus } from "react-icons/go"
import ReactMarkdown from 'react-markdown'
import remarkBreaks from "remark-breaks"
import NoProductFound from '../../assets/original-edbc9b1a905204e54ac50ca36215712a.webp'
import { useAppContext } from "../../context/AppContext"
import ProductAddToCart from "./ProductAddToCart"
import HeaderComponent from "../../component/Header"
import Sidebar from "../../component/Sidebar"
import SearchPage from "../SearchPage/SearchPage"
import customerSvc from "../../service/customer.service"
import ProductReviewSection from "./reviewSection"

export interface ProductCartProps {
    setCartClicked: React.Dispatch<React.SetStateAction<boolean>>
    setBuyClick: React.Dispatch<React.SetStateAction<boolean>>
    buyClick: boolean
}

const ProductViewPage = () => {
    const { id } = useParams<{ id: string }>()
    const [productDetails, setProductDetails] = useState<ProductDetailsInterface>({} as ProductDetailsInterface)
    const [buyClick, setBuyClick] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [imagesIndex, setImagesIndex] = useState<number>(0)
    const [maxIndexValue, setMaxIndexValue] = useState<number>(0)
    const [showDescription, setShowDescription] = useState<boolean>(false)
    const [productList, setProductList] = useState<ProductDetailsInterface[]>([]);
    const [cartClicked, setCartClicked] = useState<boolean>(false)
    const { loggedInUser, searchClick, menuClick, setMenuClick, searchValue } = useAppContext();
    const [cartProductIds, setCartProductIds] = useState<any | null>(null)
    const navigate = useNavigate()

    const fetchProductDetails = useCallback(async (id: string, signal?: AbortSignal) => {
        try {
            const response = await publicSvc.getProductById(id, signal);
            setProductDetails(response.data.data)
            setMaxIndexValue(response.data.data.images.length)
        } catch (error) {
            if ((error as any)?.name === 'CanceledError' || (error as any)?.message === 'canceled') return;
            throw error
        }
    }, [])

    const fetchProductList = useCallback(async (id: string, signal?: AbortSignal) => {
        try {
            const response = await publicSvc.listProduct(id, signal);
            setProductList(response.data.data)

            if (loggedInUser?.role === 'customer') {
                const response = await customerSvc.listCart();
                setCartProductIds(() => response.data.data.map((items: any) => items?.items?.product?._id))
            }
        } catch (error) {
            if ((error as any)?.name === 'CanceledError' || (error as any)?.message === 'canceled') return;
            throw error
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    const handleProductId = (id: string) => {
        try {
            setIsLoading(true);
            navigate(`/v1/product/${id}`);
        } catch (error) {
            throw error
        }
    }

    const addToCartClick = (id: string) => {
        try {
            if (!loggedInUser) {
                navigate('/auth/login');
            }
            setCartClicked(true)
            navigate(`?id=${id}&type=cart`)
        } catch (error) {
            throw error
        }
    }

    const directPayment = async () => {
        try {
            setCartClicked(true)
            navigate(`?id=${productDetails._id}&type=buy`)
            setBuyClick(true)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    useEffect(() => {
        if (id) {
            const controller = new AbortController();

            // trigger both requests and allow abort on cleanup
            fetchProductDetails(id, controller.signal);
            fetchProductList(id, controller.signal);

            return () => controller.abort();
        }
    }, [id, fetchProductDetails, fetchProductList])

    return (
        <>
            {isLoading ? "" :
                <>
                    <div className="flex flex-col w-full h-full">
                        <HeaderComponent />
                        <div>
                            <div className={`${searchValue ? 'flex visible transition-all duration-300 h-full w-full items-center justify-center' : "hidden"}`}>
                                <SearchPage />
                            </div>
                            <div className={`flex flex-col items-center justify-center ${searchValue ? 'hidden' : 'visible'} ${searchClick ? '' : 'mt-[7vh] md:mt-[10vh]'}`}>
                                <div className="flex flex-col md:items-center md:justify-center md:gap-10 h-auto bg-black/5 rounded-md md:w-[90vw] w-full">
                                    <div className={`flex h-full w-full lg:w-[80vw] lg:h-[83vh] relative items-center justify-center`}>
                                        <div className="flex w-auto h-[45vh] md:h-auto items-center justify-center overflow-clip">
                                            <img src={productDetails.images[imagesIndex].secure_url} alt="" className="md:h-[75vh] md:w-auto " />
                                        </div>
                                        <div className="flex items-center justify-center absolute bottom-0 w-full h-[8vh] bg-gray-200/50 rounded-b-xl gap-3 md:h-[10vh] lg:h-[12vh] md:rounded-md overflow-clip">
                                            {productDetails.images.map((items, index) => (
                                                <div
                                                    key={items.secure_url}
                                                    className="flex w-[15vw] gap-2 lg:w-[10vw] md:w-[20vw] md:h-[4vh] lg:h-[6vh] h-[10vh] items-center justify-center"
                                                    onClick={() => {
                                                        setImagesIndex(index)
                                                    }}
                                                >
                                                    <img src={items.secure_url} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                        <div onClick={() => setImagesIndex(prev =>
                                            (prev - 1 + maxIndexValue) % maxIndexValue
                                        )} className="flex absolute left-0 top-1/2 -translate-y-1/2">
                                            <FaCaretLeft className="text-4xl md:text-4xl text-white border bg-black/50 rounded-md place-items-center h-[4vh] lg:h-[6vh]" />
                                        </div>
                                        <div onClick={() => setImagesIndex(prev => (prev + 1) % maxIndexValue)} className="flex absolute right-0 top-1/2 -translate-y-1/2">
                                            <FaCaretRight className="text-4xl md:text-4xl text-white border bg-black/50 rounded-md place-items-center h-[4vh] lg:h-[6vh]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full h-auto shrink-0 items-center md:gap-2">
                                        <div className="flex w-full flex-col p-2 rounded-xl md:w-[90vw] md:bg-gray-200">
                                            <div className="flex flex-col lg:h-[15vh] md:shirnk-0 md:bg-gray-200">
                                                <div className="flex flex-col w-full h-auto header-title bg-gray-200 px-2 pt-2 text-sm rounded-t-xl md:text-sm">
                                                    {productDetails.title}
                                                </div>
                                                <div className="flex bg-gray-200 px-2 text-sm header-title md:text-sm">
                                                    {productDetails.category.length > 0 ? productDetails.category[0].name : ""}
                                                </div>
                                                <div className="flex w-full h-[5vh] items-center bg-gray-200 p-2 gap-2 text-base text-gray-700 md:text-sm">
                                                    <Rate className="custom-rate" value={productDetails.rating} />
                                                    ({productDetails.totalReviews} Reviewers)
                                                </div>
                                            </div>
                                            <div className="flex w-full h-[5vh] items-center bg-gray-200 md:h-[7vh]">
                                                <div className="flex w-auto p-2 text-sm bg-gray-200 items-center justify-center header-title">
                                                    {productDetails.currency}
                                                    {`  `}
                                                    {productDetails.price}
                                                </div>
                                                <div className="bg-green-600 h-[4vh] items-center text-sm flex p-2 rounded-md header-title">
                                                    Save
                                                </div>
                                            </div>
                                            <div className="flex w-full h-[10vh] bg-gray-200 p-2 items-center justify-between rounded-b-xl header-title md:text-sm md:gap-5">
                                                {(loggedInUser?.role === 'admin' || loggedInUser?.role === 'seller') &&
                                                    <>
                                                        <div className="flex w-full h-[5vh] bg-amber-500 rounded-md items-center justify-center text-white md:text-sm lg:w-full">
                                                            <h2 className="text-sm">
                                                                Qty: {productDetails.stock}
                                                            </h2>
                                                        </div>
                                                    </>
                                                }

                                                {(loggedInUser?.role === 'customer' || loggedInUser === null) &&
                                                    <>
                                                        {
                                                            productDetails.stock === 0 ?
                                                                <div className="flex w-[45vw] h-[7vh] bg-amber-300 rounded-md items-center justify-center text-red-900 md:text-sm">
                                                                    <h2 className="text-sm">
                                                                        OUT OF STOCK
                                                                    </h2>
                                                                </div>
                                                                :
                                                                <button onClick={() => {
                                                                    if (!loggedInUser) {
                                                                        navigate('/auth/login')
                                                                    } else {
                                                                        setCartClicked(true)
                                                                        navigate(`?id=${productDetails._id}&type=cart`)
                                                                    }
                                                                }} className="flex w-[45vw] h-[7vh] bg-orange-400 p-2 items-center justify-center rounded-md text-white md:text-sm">
                                                                    ADD TO CART
                                                                </button>
                                                        }
                                                        < button onClick={() => {
                                                            if (!loggedInUser) {
                                                                navigate('/auth/login')
                                                            } else {
                                                                directPayment();
                                                            }
                                                        }} className="flex w-[45vw] h-[7vh] bg-gray-400/40 p-2 items-center justify-center rounded-md text-gray-700">
                                                            BUY NOW
                                                        </button>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className={`flex w-full lg:w-[90vw] md:rounded-md h-[7vh] bg-gray-200 p-2 items-center px-4 gap-4 text-gray-700 md:text-sm lg:text-sm`}>
                                            <GoPlus size={25} onClick={() => setShowDescription(true)} className={`${showDescription ? "hidden rounded-t-xl" : "rounded-xl"}`} />
                                            Description
                                        </div>
                                        {showDescription ?
                                            <div className="flex flex-col text-justify p-2 lg:w-[90vw] lg:rounded-md bg-gray-200 w-full h-auto gap-5 items-center justify-center px-4 md:text-lg">
                                                <div className="flex flex-col gap-2 lg:text-sm w-full">
                                                    <p className="flex flex-col gap-2 w-full">
                                                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{productDetails.description}</ReactMarkdown>
                                                    </p>
                                                </div>
                                                <GoFoldUp size={35} className="animate-bounce" onClick={() => setShowDescription(false)} />
                                            </div>
                                            : <></>}
                                    </div>
                                </div>
                               <div className="w-full mt-16 px-4 md:px-0">
  <div className="max-w-6xl mx-auto">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <ProductReviewSection />
    </div>
  </div>
</div>
                                <div style={{ width: `${window.innerWidth}px` }} className="flex flex-col items-center justify-center px-4 h-auto">
                                    <div className="flex flex-col w-[95vw] gap-3">
                                        <h1 className="flex header-title text-lg md:text-lg">
                                            BEST SELLER
                                        </h1>
                                        <div className="flex flex-col w-full gap-5">
                                            <div className="flex flex-col w-full gap-2 items-center justify-center overflow-hidden md:grid md:grid-cols-3 xl:grid-cols-5">
                                                {productList.length > 0 ? (
                                                    productList.map((item) => (
                                                        <div key={item._id}
                                                            onClick={() => {
                                                                handleProductId(item._id)
                                                            }}
                                                            className="flex border-2 w-93 rounded-md border-violet-300 md:w-full"
                                                        >
                                                            <div className="flex flex-col w-full h-[50vh] md:h-[30vh] lg:h-[50vh] gap-2 rounded-xl border-gray-500 mb-4 bg-gray-200/70 relative">
                                                                <div className="flex w-full h-full items-center justify-center">
                                                                    <img src={item.images[0]?.secure_url} className="rounded-xl w-auto h-full" alt="dress-01" />
                                                                </div>
                                                                <div className="absolute w-full bg-gray-100 flex flex-col gap-2 text-sm md:text-sm  rounded-xl font-semibold text-black h-auto overflow-hidden z-2 p-2">
                                                                    {item.title}
                                                                </div>
                                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-[50vw] items-center justify-center z-2">
                                                                    {(loggedInUser?.role === 'admin' || loggedInUser?.role === 'seller') &&
                                                                        <>
                                                                            <div className="flex w-full h-[5vh] bg-amber-500 rounded-md items-center justify-center text-white md:text-sm lg:w-[10vw] md:w-[20vw] md:h-[4vh] lg:h-[6vh]">
                                                                                <h2 className="text-sm">
                                                                                    Qty: {item.stock}
                                                                                </h2>
                                                                            </div>
                                                                        </>
                                                                    }

                                                                    {(loggedInUser?.role === 'customer' || loggedInUser === null) && (item.stock === 0 ?
                                                                        <>
                                                                            <div className="flex w-full h-[6vh] bg-amber-300 rounded-md items-center justify-center text-red-900 lg:w-[10vw] md:w-[20vw] md:h-[4vh] lg:h-[6vh]">
                                                                                <h2 className="text-sm">
                                                                                    OUT OF STOCK
                                                                                </h2>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        (cartProductIds?.includes(item._id) ?
                                                                            <h2 className="flex w-full border-gray-400 bg-teal-400 text-sm rounded-md lg:w-[10vw] md:w-[20vw] md:h-[4vh] lg:h-[6vh] text-white p-2 font-semibold items-center justify-center transition-all duration-500 h-[6vh] header-title">ADDED TO CART</h2>
                                                                            :
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    addToCartClick(item._id)
                                                                                }}
                                                                                className="flex w-full border-gray-400 bg-orange-400 text-sm rounded-md text-white p-2 font-semibold items-center justify-center transition-all duration-500 h-[6vh] header-title lg:w-[10vw] md:w-[20vw] md:h-[4vh] lg:h-[6vh]">
                                                                                ADD TO CART
                                                                            </button>
                                                                        )
                                                                    )}
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
                                                <span className='flex border border-t grow border-gray-500/30'></span>
                                            </div>
                                            <div className='flex w-full items-center justify-center mb-6'>
                                                <button className='border-2 border-gray-500 p-2 rounded-xl w-[25vw] md:w-[15vw]'>
                                                    More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-900 text-gray-300 py-10 px-5">
                                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                                    {/* Column 1 */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="cursor-pointer hover:text-white">Help & FAQs</li>
                                            <li className="cursor-pointer hover:text-white">Shipping Information</li>
                                            <li className="cursor-pointer hover:text-white">Returns & Refunds</li>
                                            <li className="cursor-pointer hover:text-white">Track Order</li>
                                        </ul>
                                    </div>

                                    {/* Column 2 */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="cursor-pointer hover:text-white">About Us</li>
                                            <li className="cursor-pointer hover:text-white">Careers</li>
                                            <li className="cursor-pointer hover:text-white">Press</li>
                                            <li className="cursor-pointer hover:text-white">Affiliate Program</li>
                                        </ul>
                                    </div>

                                    {/* Column 3 */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="cursor-pointer hover:text-white">Contact Us</li>
                                            <li className="cursor-pointer hover:text-white">Store Locator</li>
                                            <li className="cursor-pointer hover:text-white">Support</li>
                                            <li className="cursor-pointer hover:text-white">Partner With Us</li>
                                        </ul>
                                    </div>

                                    {/* Column 4 */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="cursor-pointer hover:text-white">Privacy Policy</li>
                                            <li className="cursor-pointer hover:text-white">Terms & Conditions</li>
                                            <li className="cursor-pointer hover:text-white">Cookie Policy</li>
                                            <li className="cursor-pointer hover:text-white">Disclaimer</li>
                                        </ul>
                                    </div>

                                </div>

                                {/* Bottom section */}
                                <div className="border-t border-gray-700 mt-8 pt-5 text-center text-sm text-gray-500">
                                    © {new Date().getFullYear()} YourCompany. All rights reserved.
                                </div>
                            </div>
                        </div>
                        {menuClick && (
                            <div
                                onClick={() => setMenuClick(false)}
                                className="fixed inset-0 bg-black/70 z-2 w-full h-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            >

                            </div>
                        )}
                        {menuClick && (
                            <div className="fixed top-1/2 -translate-y-1/2 left-1/2 z-3 -translate-x-1/2 text-justify p-4 pt-10 h-[70vh] w-[95vw] text-white font-bold text-sm title-header bg-black/50">
                                <Sidebar />
                            </div>
                        )}
                        {cartClicked &&
                            <>
                                <div
                                    onClick={() => setCartClicked(false)}
                                    className="fixed inset-0 w-full h-full bg-black/50 z-2"
                                >

                                </div>

                                <div className="fixed top-1/2 -translate-y-1/2 left-1/2 z-3 -translate-x-1/2 text-justify p-4 h-[60vh] w-[90vw] md:w-[60vw] lg:w-[30vw] md:h-auto font-bold text-sm title-header bg-black/20 rounded-xl">
                                    <ProductAddToCart setCartClicked={setCartClicked} setBuyClick={setBuyClick} buyClick={buyClick} />
                                </div>
                            </>
                        }
                    </div>
                </>
            }
        </>
    )
}

export default ProductViewPage