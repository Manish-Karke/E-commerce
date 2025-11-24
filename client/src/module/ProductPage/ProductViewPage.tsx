import { useCallback, useEffect, useState } from "react"
import publicSvc from "../../service/public.service"
import type { ProductDetailsInterface } from "./product.validation"
import { useNavigate, useParams } from "react-router-dom"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { Rate } from "antd"
import { GoFoldUp, GoPlus } from "react-icons/go"
import ReactMarkdown from 'react-markdown'
import remarkBreaks from "remark-breaks"
import { MdOutlineArrowCircleLeft } from "react-icons/md"
import NoProductFound from '../../assets/original-edbc9b1a905204e54ac50ca36215712a.webp'
import { useAppContext } from "../../context/AppContext"
import ProductAddToCart from "./ProductAddToCart"
import HeaderComponent from "../../component/Header"
import Sidebar from "../../component/Sidebar"
import SearchPage from "../SearchPage/SearchPage"
import customerSvc from "../../service/customer.service"

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

    const backNavigate = () => {
        try {
            navigate('/v1/home');
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

                            <div className={`md:p-4 ${searchValue ? 'hidden' : 'visible'}`}>
                                <div className={`flex w-full h-[50vh] md:h-[75vh] relative items-center justify-center ${searchClick ? 'md:-mt-8' : 'mt-[7vh] md:mt-[8vh]'}`}>
                                    <div className="absolute top-0 left-2">
                                        <MdOutlineArrowCircleLeft className="text-3xl md:text-6xl" onClick={() => backNavigate()} />
                                    </div>
                                    <div className="flex w-auto h-[45vh] items-center justify-center overflow-clip">
                                        <img src={productDetails.images[imagesIndex].secure_url} alt="" className="md:h-[75vh] md:w-auto "/>
                                    </div>
                                    <div className="flex items-center justify-center absolute bottom-0 w-full h-[8vh] bg-gray-200/50 rounded-b-xl gap-3 md:h-[15vh] overflow-clip">
                                        {productDetails.images.map((items, index) => (
                                            <div
                                                key={items.secure_url}
                                                className="flex w-[15vw] h-[10vh] items-center justify-center"
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
                                        <FaCaretLeft className="text-3xl md:text-6xl"/>
                                    </div>
                                    <div onClick={() => setImagesIndex(prev => (prev + 1) % maxIndexValue)} className="flex absolute right-0 top-1/2 -translate-y-1/2">
                                        <FaCaretRight className="text-3xl md:text-6xl"/>
                                    </div>
                                </div>
                                <div className="flex flex-col p-2 rounded-xl md:h-[32vh]">
                                    <div className="flex flex-col md:h-[15vh] md:shirnk-0 md:bg-gray-200">
                                        <div className="flex flex-col w-full h-auto header-title bg-gray-200 px-2 pt-2 text-xl rounded-t-xl md:text-3xl">
                                            {productDetails.title}
                                        </div>
                                        <div className="flex bg-gray-200 px-2 text-xl header-title md:text-2xl">
                                            {productDetails.category.length > 0 ? productDetails.category[0].name : ""}
                                        </div>
                                        <div className="flex w-full h-[5vh] items-center bg-gray-200 p-2 gap-2 text-base text-gray-700 md:text-xl">
                                            <Rate className="custom-rate" value={productDetails.rating} />
                                            ({productDetails.totalReviews} Reviewers)
                                        </div>
                                    </div>
                                    <div className="flex w-full h-[5vh] items-center bg-gray-200 md:h-[7vh]">
                                        <div className="flex w-auto p-2 text-3xl bg-gray-200 items-center justify-center header-title">
                                            {productDetails.currency}
                                            {`  `}
                                            {productDetails.price}
                                        </div>
                                        <div className="bg-green-600 h-[4vh] items-center text-xl flex p-2 rounded-md header-title">
                                            Save
                                        </div>
                                    </div>
                                    <div className="flex w-full h-[10vh] bg-gray-200 p-2 items-center justify-between rounded-b-xl header-title md:text-2xl">
                                        {(loggedInUser?.role === 'admin' || loggedInUser?.role === 'seller') &&
                                            <>
                                                <div className="flex w-full h-[5vh] bg-amber-500 rounded-md items-center justify-center text-white md:text-2xl lg:w-full">
                                                    <h2 className="text-xl">
                                                        Qty: {productDetails.stock}
                                                    </h2>
                                                </div>
                                            </>
                                        }

                                        {(loggedInUser?.role === 'customer' || loggedInUser === null) &&
                                            <>
                                                {
                                                    productDetails.stock === 0 ?
                                                        <div className="flex w-[45vw] h-[7vh] bg-amber-300 rounded-md items-center justify-center text-red-900 md:text-2xl">
                                                            <h2 className="text-xl">
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
                                                        }} className="flex w-[45vw] h-[7vh] bg-orange-400 p-2 items-center justify-center rounded-md text-white md:text-2xl">
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
                                <div className={`
                        flex w-full h-[7vh] bg-gray-200 p-2 items-center px-4 gap-4 text-gray-700 md:text-xl lg:text-2xl
                    `}>
                                    <GoPlus size={25} onClick={() => setShowDescription(true)} className={`${showDescription ? "hidden rounded-t-xl" : "rounded-xl"}`} />
                                    Description
                                </div>
                                {showDescription ?
                                    <div className="flex flex-col text-justify p-2 bg-gray-200 w-full h-auto gap-5 px-4 items-center justify-center md:text-xl">
                                        <div className="flex flex-col gap-2 lg:text-2xl">
                                            <ReactMarkdown remarkPlugins={[remarkBreaks]}>{productDetails.description}</ReactMarkdown>
                                        </div>
                                        <GoFoldUp size={35} className="animate-bounce" onClick={() => setShowDescription(false)} />
                                    </div>
                                    : <></>}
                                <div className="flex w-full h-auto rounded-xl mt-1 items-center justify-center">
                                    <div className="flex flex-col mt-3 w-full">
                                        <h1 className="flex header-title text-xl md:text-2xl lg:text-3xl">RECOMMENDED PRODUCTS</h1>
                                        <div className="flex flex-col w-full mt-4 gap-5">
                                            <div className="flex flex-col w-full gap-2 items-center justify-center overflow-hidden md:grid md:grid-cols-2 md:gap-5 xl:grid-cols-4">
                                                {productList.length > 0 ? (
                                                    productList.map((item) => (
                                                        <div key={item._id}
                                                            onClick={() => {
                                                                handleProductId(item._id)
                                                            }}
                                                            className="flex border-2 w-full rounded-md border-violet-300 md:w-88 lg:w-full"
                                                        >
                                                            <div className="flex flex-col w-90 h-[50vh] gap-2 rounded-xl border-gray-500 mb-4 bg-gray-200/70 relative md:w-full">
                                                                <div className="aboslute flex w-full h-full place-items-center items-center justify-center">
                                                                    <img src={item.images[0]?.secure_url} className="rounded-xl w-auto h-full" alt="dress-01" />
                                                                </div>
                                                                <div className="absolute w-full bg-gray-100 lg:text-3xl flex flex-col gap-2 text-xl px-10 rounded-xl font-semibold md:text-2xl text-black h-auto overflow-hidden z-2 p-2">
                                                                    {item.title}
                                                                </div>
                                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-[50vw] items-center justify-center z-2 ">
                                                                    {(loggedInUser?.role === 'admin' || loggedInUser?.role === 'seller') &&
                                                                        <>
                                                                            <div className="flex w-full h-[5vh] bg-amber-500 rounded-md items-center justify-center text-white md:w-80 md:text-2xl">
                                                                                <h2 className="text-xl">
                                                                                    Qty: {item.stock}
                                                                                </h2>
                                                                            </div>
                                                                        </>
                                                                    }

                                                                    {(loggedInUser?.role === 'customer' || loggedInUser === null) && (item.stock === 0 ?
                                                                        <>
                                                                            <div className="flex w-full h-[6vh] bg-amber-300 rounded-md items-center justify-center text-red-900 md:w-80 md:text-2xl">
                                                                                <h2 className="text-xl">
                                                                                    OUT OF STOCK
                                                                                </h2>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        (cartProductIds?.includes(item._id) ?
                                                                            <h2 className="flex w-full border-gray-400 bg-teal-400 text-xl rounded-md text-white p-2 font-semibold items-center justify-center md:text-2xl transition-all duration-500 h-[6vh] header-title md:w-80">ADDED TO CART</h2>
                                                                            :
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    addToCartClick(item._id)
                                                                                }}
                                                                                className="flex w-full border-gray-400 bg-orange-400 text-xl rounded-md text-white p-2 font-semibold items-center justify-center md:text-2xl transition-all duration-500 h-[6vh] header-title md:w-80">
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
                                                <span className='flex border border-t grow border-gray-500'></span>
                                            </div>
                                            <div className='flex w-full items-center justify-center mb-6'>
                                                <button className='border-2 border-gray-500 p-2 rounded-xl w-[25vw] md:text-2xl lg:text-3xl'>
                                                    More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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