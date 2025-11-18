import { useCallback, useEffect, useState } from "react";
import { AiOutlineGift, AiOutlinePicture, AiOutlineTag, AiOutlineUser } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import adminSvc from "../../service/admin.service";
import type { BannerResponse, CategoryResponse, CouponResponse, UserResponse } from "./admin.validator";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userList, setUserList] = useState<UserResponse | null>(null)
    const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null)
    const [bannerList, setBannerList] = useState<BannerResponse | null>(null)
    const [couponList, setCouponList] = useState<CouponResponse | null>(null)

    const dashboardDetails = useCallback(async () => {
        try {
            const listUser = await adminSvc.listUsers();
            setUserList(listUser)

            const listCategory = await adminSvc.listCategory();
            setCategoryList(listCategory)

            const listBanner = await adminSvc.listActiveBanners(true);
            setBannerList(listBanner)

            const listCoupon = await adminSvc.listActiveCoupons(true);
            setCouponList(listCoupon);
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        dashboardDetails();
    }, [])

    return (
        <>
            {!isLoading &&
                <>
                    <div className="flex w-full flex-col">
                        <div className="flex w-full flex-col gap-4">
                            <h1 className="flex header-title text-2xl bg-gray-100 rounded-md p-2 w-full h-[5vh] shrink-0">
                                Dashboard
                            </h1>
                            <div className="grid grid-cols-2 w-full h-[38vh] p-2 gap-2">
                                <div className="flex flex-col w-full h-[17vh] shirnk-0 border border-violet-300">
                                    <div className="flex flex-col items-center justify-center h-full w-full text-lg gap-1">
                                        <p>
                                            {userList?.options.total}
                                        </p>
                                        <p className='header-title'>
                                            Total Users
                                        </p>
                                        <AiOutlineUser size={45} className="text-blue-700" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full h-[17vh] shirnk-0 border border-violet-300">
                                    <div className="flex flex-col items-center justify-center h-full w-full text-lg gap-1">
                                        <p>
                                            {categoryList?.options.total}
                                        </p>
                                        <p className='header-title'>
                                            Total Categories
                                        </p>
                                        <AiOutlineTag size={45} className="text-blue-700" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full h-[17vh] shirnk-0 border border-violet-300">
                                    <div className="flex flex-col items-center justify-center h-full w-full text-lg gap-1">
                                        <p>
                                            {bannerList?.options.total}
                                        </p>
                                        <p className='header-title'>
                                            Active Banners
                                        </p>
                                        <AiOutlinePicture size={45} className="text-blue-700" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full h-[17vh] shirnk-0 border border-violet-300">
                                    <div className="flex flex-col items-center justify-center h-full w-full text-lg gap-1">
                                        <p>
                                            {couponList?.options.total}
                                        </p>
                                        <p className='header-title'>
                                            Active Coupons
                                        </p>
                                        <AiOutlineGift size={45} className="text-blue-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full bg-gray-50">
                            <h1 className="flex header-title p-2 bg-gray-200 rounded-md w-full text-xl">
                                QUICK MANAGEMENT LINKS
                            </h1>
                            <div className="grid grid-cols-2 gap-2 w-full p-2 mt-2 bg-gray-200 h-[15vh]">
                                <button onClick={() => navigate('/admin/banner')} className="flex p-2 bg-green-950/80 rounded-md text-white text-xl header-title items-center justify-center w-full">Manage Banner</button>
                                <button onClick={() => navigate('/admin/category')} className="flex p-2 bg-green-950/80 rounded-md text-white text-xl header-title items-center justify-center w-full">Manage Category</button>
                                <button onClick={() => navigate('/admin/coupon')} className="flex p-2 bg-green-950/80 rounded-md text-white text-xl header-title items-center justify-center w-full">Manage Coupon</button>
                                <button onClick={() => navigate('/admin/users')} className="flex p-2 bg-green-950/80 rounded-md text-white text-xl header-title items-center justify-center w-full">Manage User</button>
                            </div>
                        </div>
                    </div>
                </>}
        </>
    )
}

export default AdminDashboardPage