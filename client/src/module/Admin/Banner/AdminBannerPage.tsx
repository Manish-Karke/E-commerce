import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineSmile } from "react-icons/ai";
import AdminBannerCreatePage from "./AdminBannerCreatePage";
import AdminBannerUpdatePage from "./AdminBannerUpdatePage";
import { useNavigate } from "react-router-dom";
import type { BannerResponse } from "../admin.validator";
import adminSvc from "../../../service/admin.service";
import { useAppContext } from "../../../context/AppContext";

const AdminBannerPage = () => {
    const { bannerAddClick, setBannerAddClick } = useAppContext();
    const isBanner = location.pathname.includes('update')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const [bannerList, setBannerList] = useState<BannerResponse | null>(null)

    const bannerListFetch = useCallback(async () => {
        try {
            const listBanner = await adminSvc.listActiveBanners(null);
            setBannerList(listBanner)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const bannerDeleteById = useCallback(async (id: string) => {
        await adminSvc.bannerDeleteById(id)
        bannerListFetch() // refetch after delete
    }, [bannerListFetch])


    useEffect(() => {
        bannerListFetch();
    }, [location.pathname, bannerAddClick])

    return (
        <>
            {!isLoading &&
                <>
                    {isBanner ?
                        <div className="flex flex-col w-full h-full p-4 gap-4 bg-gray-100 rounded-md md:text-2xl">
                            <h2 className="text-2xl header-title md:text-3xl">
                                Update Banner
                            </h2>
                            <div className="flex flex-col bg-gray-200 rounded-md p-4 border border-violet-300">
                                <AdminBannerUpdatePage />
                            </div>
                        </div> :
                        <>
                            <div className="flex flex-col w-full h-full">
                                <div className="flex flex-col w-full h-auto shrink-0 p-4 gap-2 text-xl bg-gray-100 rounded-md">
                                    <h2 className="flex header-title text-2xl md:text-3xl">
                                        Banners
                                    </h2>
                                    <div
                                        className={`
                                        flex flex-col text-gray-700 gap-5 border border-violet-200 p-4 rounded-xl w-full h-[75vh] shrink-0 items-center justify-center
                                        ${bannerAddClick ? 'visible' : 'hidden'}
                                    `}>
                                        <AdminBannerCreatePage />
                                    </div>
                                </div>
                                <div className="flex flex-col px-4 pt-2 gap-4">
                                    <div className="flex items-center w-full justify-between">
                                        <p className="header-title md:text-2xl">
                                            Existing Banners
                                        </p>
                                        <div className="text-green-800 font-semibold">
                                            <AiOutlinePlusCircle onClick={() => setBannerAddClick((prev) => !prev)} className={`text-4xl md:text-5xl ${bannerAddClick && 'hidden'}`} />
                                            <AiOutlineMinusCircle onClick={() => setBannerAddClick((prev) => !prev)} className={`text-4xl md:text-5xl ${!bannerAddClick && 'hidden'}`} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full h-auto rounded-md gap-2 md:gap-4 bg-gray-50 py-2">
                                        {bannerList?.data.map((items, index) => (
                                            <div key={index}>
                                                <div className="flex gap-2 h-[7vh] md:h-[10vh] w-full shrink-0 items-center justify-between bg-gray-100 p-2 rounded-md">
                                                    <p className="flex text-lg md:text-2xl">
                                                        {items.title}
                                                    </p>
                                                    <div className="flex gap-4 text-white">
                                                        <AiOutlineEdit size={30} onClick={() => navigate(`update/${items._id}`)} className="bg-blue-800 rounded-md w-[10vw] h-[10vw] p-2" />
                                                        <AiOutlineDelete size={30} onClick={() => bannerDeleteById(items._id)} className="bg-red-700 rounded-md p-2 w-[10vw] h-[10vw]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {bannerList?.data.length === 0 &&
                                            <div className="flex gap-2 h-[7vh] w-full shrink-0 items-center justify-center">
                                                <p className="flex text-lg">
                                                    No Banner Found
                                                </p>
                                                <AiOutlineSmile size={25} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </>
    )
}

export default AdminBannerPage