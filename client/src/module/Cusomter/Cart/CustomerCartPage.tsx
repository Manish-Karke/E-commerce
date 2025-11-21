import { useCallback, useEffect, useState } from "react"
import type { CartResponse } from "./cart.validation"
import customerSvc from "../../../service/customer.service"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import CartUpdatePage from "./CartUpdatePage"

const CustomerCartPage = () => {
    const [cartList, setCartList] = useState<CartResponse | null>(null)
    const [cartClicked, setCartClicked] = useState<boolean>(false)
    const navigate = useNavigate();

    const fetchCartList = useCallback(async () => {
        const response = await customerSvc.listCart();
        setCartList(response.data)
    }, []);

    useEffect(() => {
        fetchCartList();
    }, [])

    const cartDeleteById = async (id: string) => {

    }

    const updateCart = async (id: string) => {
        navigate(`?id=${id}`)
        setCartClicked(true)
    }

    console.log(cartList)

    return (
        <>
            <div className="flex flex-col w-full h-full gap-5 p-2">
                {cartList?.data.map((items, index) => (
                    <div key={index} className="flex flex-col w-full h-[60vh] shrink-0 border border-violet-300 rounded-md gap-1 p-2">
                        <div className="flex flex-col w-full h-auto gap-2">
                            <div className="flex flex-col w-full h-[50vh] shrink-0 gap-1">
                                <h1 className="flex text-xl h-[8vh] shrink-0 bg-amber-500 w-full items-center justify-center p-2 rounded-md ">
                                    {items.items.product.title}
                                </h1>
                                <div className="flex w-auto h-[42vh] shrink-0 relative">
                                    <img src={items.items.product.images[0].secure_url} alt="cart-image" className="flex w-full h-auto" />
                                    <div className="absolute left-1/2 -translate-x-1/2">
                                        <h2 className="flex">
                                            Quantity: {items.items.quantity}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 text-white w-full h-[7vh] items-center justify-center">
                                <AiOutlineEdit size={30} onClick={() => updateCart(items._id)} className="bg-blue-800 rounded-md w-[50%] h-[10vw] p-2" />
                                <AiOutlineDelete size={30} onClick={() => cartDeleteById(items._id)} className="bg-red-700 rounded-md p-2 w-[50%] h-[10vw]" />
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
        </>
    )
}

export default CustomerCartPage