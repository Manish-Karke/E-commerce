import { useCallback, useEffect, useState } from "react"
import type { CartResponse } from "./cart.validation"
import customerSvc from "../../../service/customer.service"
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { useNavigate, useSearchParams } from "react-router-dom"
import CartUpdatePage from "./CartUpdatePage"
import { Empty, Spin } from "antd"
import type { ListProductDetails } from "../../HomePage/homepage.validation"
import publicSvc from "../../../service/public.service"
import { useAppContext } from "../../../context/AppContext"
import SearchPage from "../../SearchPage/SearchPage"

const CustomerCartPage = () => {
    const [cartList, setCartList] = useState<CartResponse | null>(null)
    const [cartClicked, setCartClicked] = useState<boolean>(false)
    const [orderItemClick, setOrderItemsClick] = useState<boolean>(false)
    const [orderItemsDetails, setOrderItemsDetails] = useState<any>([])
    const [orderItemsCartIds, setOrderItemsCartIds] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [onlinePayClick, setOnlinePayClick] = useState<boolean>(false)
    const [listProductDetails, setListProductDetails] = useState<ListProductDetails[]>([])
    const [searchParams] = useSearchParams();
    const { loggedInUser, searchValue } = useAppContext();
    const Id = searchParams.get('id')
    const navigate = useNavigate();
    const orderItem = searchParams.get('orderItem')
    const query = Object.fromEntries([...searchParams])
    const isSuccess = location.pathname.includes('khalti-success')
    const [addToCartEffect, setAddToCartEffect] = useState<boolean>(false)

    const listProducts = useCallback(async (id?: string) => {
        try {
            setIsLoading(true)
            const response = await publicSvc.listProduct(id);
            setListProductDetails(response.data.data);
        } catch (error) {
            console.log("Error listing products")
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchCartList = useCallback(async () => {
        try {
            const response = await customerSvc.listCart();
            setCartList(response.data)

            const orderResponse = await customerSvc.orderItem();
            setOrderItemsDetails(orderResponse)
            setOrderItemsCartIds(() => orderResponse.data.map((items: any) => items.items.cartId))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, []);

    const cartDeleteById = async (id: string) => {
        try {
            await customerSvc.deleteCartById(id)
            await fetchCartList();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCartList();
        listProducts();
    }, [Id, fetchCartList, isSuccess])

    const updateCart = async (id: string) => {
        navigate(`?id=${id}`)
        setCartClicked(true)
    }

    const buyItem = async (id: string) => {
        setOrderItemsClick(true);
        navigate(`?orderItem=${id}`)
    }

    const cashPay = async () => {
        await customerSvc.checkout(orderItem!)
        navigate('/customer/cart')
        setOrderItemsClick(false)
    }

    const onlinePay = async (id: string) => {
        setOnlinePayClick(true)
        navigate(`?orderItem=${id}&onlinePay=khalti-pay`)
        try {
            const response = await customerSvc.onlinePayment(id)
            window.location.href = (`${response.data.data.payment_url}`);
        } catch (error) {
            console.log(error)
        }
    }

    const savePayment = async (query: any) => {
        try {
            await customerSvc.savePayment(query);
            navigate('/customer/cart')
        } catch (error) {
            console.log(error)
            throw error
        }
    }

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
            navigate(`?id=${id}`)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        if (isSuccess && query) {
            const save = async () => {
                try {
                    await savePayment(query);
                } catch (error) {
                    console.log(error)
                    throw error
                }
            };

            save();
        }
    }, [isSuccess, query])

    const directPayment = async () => {
        const response = await customerSvc.checkout(orderItem!)
        const id = response.data._id
        if (id) {
            navigate(`?orderItem=${id}&onlinePay=khalti-pay`)
            const response = await customerSvc.onlinePayment(id)
            window.location.href = (`${response.data.data.payment_url}`);
        }
    }

    return (
        <>
            {!isLoading &&
                <>
                    <div className={`${searchValue ? 'visible' : 'hidden'}`}>
                        <SearchPage/>
                    </div>
                    <div className={`flex flex-col w-full h-full gap-5 p-2 ${searchValue ? "hidden" : 'visible'}`}>
                        <div className="flex p-2">
                            <h2 className="flex text-xl">
                                Carts List
                            </h2>
                        </div>
                        {cartList?.data.length === 0 ?
                            <div className="flex flex-col gap-5 w-full items-center justify-center">
                                <div className="flex flex-col w-full h-[35vh] shrink-0 items-center justify-center">
                                    <Empty />
                                </div>

                                <div className="flex w-full flex-col p-2">
                                    <h2 className="flex text-xl">
                                        Recommended Product
                                    </h2>
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
                                                    <Empty />
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
                            : cartList?.data.map((items, index) => (
                                <div key={index} onClick={() => {
                                    navigate(`cartView/${items.items.product._id}`)
                                }} className="flex flex-col w-full h-[67vh] shrink-0 border border-violet-300 rounded-md gap-1 p-2">
                                    <div className="flex flex-col w-full h-auto gap-2">
                                        <div className="flex flex-col w-full h-[50vh] shrink-0 gap-1">
                                            <h1 className="flex text-xl h-[8vh] shrink-0 bg-amber-500 w-full items-center justify-center p-2 rounded-md ">
                                                {items.items.product.title}
                                            </h1>
                                            <div className="flex w-auto h-[42vh] shrink-0 relative">
                                                <div className="flex items-center justify-center w-full h-full truncate">
                                                    <img src={items.items.product.images[0].secure_url} alt="cart-image" className="flex w-auto h-[42vh]" />
                                                </div>
                                                <div className="absolute left-0 z-4">
                                                    <div className="flex flex-col w-full">
                                                        <h2 className="flex">
                                                            Quantity: {items.items.quantity}
                                                        </h2>
                                                        <h2>
                                                            Price @13% VAT: {items.items.price / 100}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-white w-full h-[7vh] items-center justify-center">
                                            <AiOutlineEdit size={30} onClick={(e) => {
                                                e.stopPropagation()
                                                updateCart(items._id)
                                            }} className="bg-blue-800 rounded-md w-[50%] h-[10vw] p-2" />
                                            <AiOutlineDelete size={30} onClick={(e) => {
                                                e.stopPropagation();
                                                cartDeleteById(items._id)
                                            }} className="bg-red-700 rounded-md p-2 w-[50%] h-[10vw]" />
                                        </div>
                                        <div className="flex items-center justify-center w-full h-[6vh] shrink-0 rounded-md">
                                            {orderItemsCartIds?.includes(items._id) ?
                                                (
                                                    orderItemsDetails.data
                                                        .filter((data: any) => data.items.cartId === items._id)
                                                        .map((data: any, index: number) => (
                                                            <h2 key={index} onClick={(e) => {
                                                                e.stopPropagation();
                                                                onlinePay(data._id)
                                                            }} className="text-lg bg-amber-400 w-full h-[6vh] items-center justify-center rounded-md p-2 flex">
                                                                {data.paymentStatus !== 'paid' ? "Online Pay" : 'Order Paid'}
                                                            </h2>
                                                        ))
                                                )
                                                :
                                                <>
                                                    <h2
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            buyItem(items._id)
                                                        }}
                                                        className="text-lg bg-amber-400 w-full h-[5vh] items-center justify-center rounded-md p-2 flex">
                                                        Order Item
                                                    </h2>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {cartClicked &&
                        <>
                            <div
                                onClick={() => setCartClicked(false)}
                                className="fixed inset-0 w-full h-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            >
                            </div>

                            <div className="fixed top-1/2 -translate-y-1/2 left-1/2 z-3 -translate-x-1/2 text-justify p-4 h-[60vh] w-[90vw] font-bold text-xl title-header bg-black/20 rounded-xl">
                                <CartUpdatePage setCartClicked={setCartClicked} />
                            </div>
                        </>
                    }

                    {orderItemClick &&
                        <>
                            <div className="flex w-full h-full inset-0 bg-black/20 fixed" onClick={() => setOrderItemsClick(false)}>

                            </div>
                            <div className="w-[90vw] h-[16vh] bg-gray-100 rounded-md fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2">
                                <div className="w-full flex-col h-[7vh] flex p-2 px-4 items-end justify-between">
                                    <div
                                        onClick={() => {
                                            setOrderItemsClick(false)
                                            navigate('/customer/cart')
                                        }}
                                        className="flex border border-violet-300 p-1 h-[5vh] w-[5vh] rounded-md ">
                                        <AiOutlineClose size={35} />
                                    </div>
                                    <div className="flex w-full text-lg">
                                        <h2>
                                            Payment Method
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex w-full h-[8vh] gap-2 items-center justify-center p-3 mt-2 text-lg">
                                    <button className="w-full bg-amber-500 h-[5vh]" onClick={() => {
                                        directPayment()
                                    }}>
                                        <h2>
                                            Online Pay
                                        </h2>
                                    </button>
                                    <button className="w-full bg-amber-500 h-[5vh]" onClick={() => cashPay()}>
                                        <h2>
                                            Cash Pay
                                        </h2>
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                    {onlinePayClick &&
                        <>
                            <div className="flex w-full h-full inset-0 bg-black/20 fixed">

                            </div>
                            <div className="w-[90vw] h-[16vh] bg-gray-100 rounded-md fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2">
                                <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                                    <h2 className="text-lg">
                                        Procedding to Khalti Pay
                                    </h2>
                                    <Spin />
                                    <div className="flex w-full items-center justify-center h-[6vh]">
                                        <button onClick={() => {
                                            setOnlinePayClick(false)
                                            navigate("/customer/cart")
                                        }} className="flex w-[50vw] h-[5vh] bg-gray-400 rounded-md items-center justify-center">
                                            <h2 className="text-lg">
                                                Cancel
                                            </h2>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {isSuccess &&
                        <>
                            <div className="flex w-full h-full inset-0 bg-black/20 fixed">

                            </div>
                            <div className="w-[90vw] h-[16vh] bg-gray-100 rounded-md fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2">
                                <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                                    <h2 className="text-lg">
                                        Wait a second
                                    </h2>
                                    <Spin />
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </>
    )
}

export default CustomerCartPage