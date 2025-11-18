import { useCallback, useEffect, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineSmile } from "react-icons/ai"
import { useNavigate, Outlet } from "react-router-dom"
import AdminCouponCreatePage from "./AdminCouponCreatePage"
import { type CategoryResponse, type CouponResponse } from "../admin.validator"
import adminSvc from "../../../service/admin.service"

export interface AdminCouponPageProps {
    setAddClick: React.Dispatch<React.SetStateAction<boolean>>
    categoryList: CategoryResponse | null
}

const AdminCouponPage = () => {
    const isCoupon = location.pathname.includes('update')
    const [addClick, setAddClick] = useState<boolean>(false)
    const [couponList, setCouponList] = useState<CouponResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null)
    const navigate = useNavigate()

    const fetchCouponList = useCallback(async () => {
        try {
            const response = await adminSvc.listActiveCoupons(true)
            setCouponList(response)

            const categoryList = await adminSvc.listCategory();
            setCategoryList(categoryList)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const deleteCouponById = useCallback(async (token: string) => {
        await adminSvc.deleteCouponById(token);
        fetchCouponList();
    }, [fetchCouponList])

    useEffect(() => {
        fetchCouponList();
    }, [addClick])

    return (
        <>
            {!isLoading &&
                (
                    isCoupon ?
                        <div className="flex flex-col w-full h-full p-4 gap-4 bg-gray-100 rounded-md ">
                            <h2 className="text-2xl header-title">
                                Update Coupon
                            </h2>
                            <div className="flex flex-col bg-gray-200 rounded-md p-4 border border-violet-300">
                                <Outlet context={{ setAddClick, categoryList }} />
                            </div>
                        </div> :
                        <>
                            <div className="flex flex-col w-full h-full">
                                <div className="flex flex-col w-full h-auto shrink-0 p-4 gap-2 text-xl bg-gray-100 rounded-md">
                                    <h2 className="flex header-title text-2xl">
                                        Coupons
                                    </h2>
                                    <div
                                        className={`
                            flex flex-col text-gray-700 gap-5 border border-violet-200 p-4 rounded-xl w-full h-[52vh] shrink-0 items-center justify-center
                            ${addClick ? 'visible' : 'hidden'}
                        `}>
                                        <AdminCouponCreatePage setAddClick={setAddClick} categoryList={categoryList}/>
                                    </div>
                                </div>
                                <div className="flex flex-col px-4 pt-2 gap-4">
                                    <div className="flex items-center w-full justify-between">
                                        <p className="header-title">
                                            Existing Coupons
                                        </p>
                                        <div className="text-green-800 font-semibold">
                                            <AiOutlinePlusCircle onClick={() => setAddClick((prev) => !prev)} size={30} className={`${addClick && 'hidden'}`} />
                                            <AiOutlineMinusCircle onClick={() => setAddClick((prev) => !prev)} size={30} className={`${!addClick && 'hidden'}`} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full h-auto rounded-md gap-2 bg-gray-50 py-2">
                                        {couponList?.data?.map((items, index) => (
                                            <div key={index}>
                                                <div className="flex gap-2 h-[7vh] w-full shrink-0 items-center justify-between bg-gray-100 p-2 rounded-md">
                                                    <p className="flex text-lg">
                                                        {items.code}
                                                    </p>
                                                    <div className="flex gap-4 text-white">
                                                        <AiOutlineEdit size={30} onClick={() => navigate(`update/${items._id}`)} className="bg-blue-800 rounded-md w-[10vw] h-[10vw] p-2" />
                                                        <AiOutlineDelete size={30} onClick={() => deleteCouponById(items._id)} className="bg-red-700 rounded-md p-2 w-[10vw] h-[10vw]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {couponList?.data.length === 0 &&
                                            <div className="flex gap-2 h-[7vh] w-full shrink-0 items-center justify-center">
                                                <p className="flex text-lg">
                                                    No Coupon Found
                                                </p>
                                                <AiOutlineSmile size={25} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                )
            }
        </>
    )
}

export default AdminCouponPage