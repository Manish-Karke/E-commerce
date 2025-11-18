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

const ProductViewPage = () => {
    const { id } = useParams<{ id: string }>()

    const [productDetails, setProductDetails] = useState<ProductDetailsInterface>({} as ProductDetailsInterface)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [imagesIndex, setImagesIndex] = useState<number>(0)
    const [maxIndexValue, setMaxIndexValue] = useState<number>(0)
    const [showDescription, setShowDescription] = useState<boolean>(false)
    const [productList, setProductList] = useState<ProductDetailsInterface[]>([]);
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
                    <div className="flex w-full h-[50vh] relative">
                        <div className="absolute top-3 left-2">
                            <MdOutlineArrowCircleLeft size={35} onClick={() => backNavigate()} />
                        </div>
                        <div className="flex w-full h-[45vh] items-center justify-center">
                            <img src={productDetails.images[imagesIndex].secure_url} alt="" />
                        </div>
                        <div className="flex items-center justify-center absolute bottom-0 w-full h-[8vh] bg-gray-200/50 rounded-b-xl gap-3">
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
                            <FaCaretLeft size={35} />
                        </div>
                        <div onClick={() => setImagesIndex(prev => (prev + 1) % maxIndexValue)} className="flex absolute right-0 top-1/2 -translate-y-1/2">
                            <FaCaretRight size={35} />
                        </div>
                    </div>
                    <div className="flex flex-col p-2 rounded-xl">
                        <div className="flex flex-col">
                            <div className="flex flex-col w-full h-auto header-title bg-gray-200 px-2 pt-2 text-xl rounded-t-xl">
                                {productDetails.title}
                            </div>
                            <div className="flex bg-gray-200 px-2 text-xl header-title">
                                {productDetails.category.length > 0 ? productDetails.category[0].name : ""}
                            </div>
                            <div className="flex w-full h-[5vh] items-center bg-gray-200 p-2 gap-2 text-base text-gray-700">
                                <Rate className="custom-rate" value={productDetails.rating} />
                                ({productDetails.totalReviews} Reviewers)
                            </div>
                        </div>
                        <div className="flex w-full h-[5vh] items-center bg-gray-200">
                            <div className="flex w-auto p-2 text-3xl bg-gray-200 items-center justify-center header-title">
                                {productDetails.currency}
                                {`  `}
                                {productDetails.price}
                            </div>
                            <div className="bg-green-600 h-[4vh] items-center text-xl flex p-2 rounded-md header-title">
                                Save
                            </div>
                        </div>
                        <div className="flex w-full h-[10vh] bg-gray-200 p-2 items-center justify-between rounded-b-xl header-title">
                            <button className="flex w-[45vw] h-[7vh] bg-orange-400 p-2 items-center justify-center rounded-md text-white">
                                ADD TO CART
                            </button>
                            <button className="flex w-[45vw] h-[7vh] bg-gray-400/40 p-2 items-center justify-center rounded-md text-gray-700">
                                BUY NOW
                            </button>
                        </div>
                    </div>
                    <div className={`
                        flex w-full h-[7vh] bg-gray-200 p-2 items-center px-4 gap-4 text-gray-700
                    `}>
                        <GoPlus size={25} onClick={() => setShowDescription(true)} className={`${showDescription ? "hidden rounded-t-xl" : "rounded-xl"}`} />
                        Description
                    </div>
                    {showDescription ?
                        <div className="flex flex-col text-justify p-2 bg-gray-200 w-full h-auto gap-5 px-4 items-center justify-center">
                            <div className="flex flex-col gap-2">
                                <ReactMarkdown remarkPlugins={[remarkBreaks]}>{productDetails.description}</ReactMarkdown>
                            </div>
                            <GoFoldUp size={35} className="animate-bounce" onClick={() => setShowDescription(false)} />
                        </div>
                        : <></>}
                    <div className="flex w-full h-auto rounded-xl mt-1 items-center justify-center">
                        <div className="flex flex-col">
                            <h1 className="flex header-title text-xl">LADIES WEARS</h1>
                            <div className="flex flex-col w-full mt-4 gap-5">
                                <div className="flex flex-col w-full gap-2 items-center justify-center overflow-hidden">
                                    {productList.length > 0 ? (
                                        productList.map((item) => (
                                            <div key={item._id}
                                                className="flex border-2 w-full rounded-md border-violet-300"
                                                onClick={() => handleProductId(item._id)}
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
                </>
            }
        </>
    )
}

export default ProductViewPage