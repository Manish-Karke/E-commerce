import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext"
import publicSvc from "../../service/public.service";
import type { ListProductDetails } from "../HomePage/homepage.validation";
import NoProductFound from '../../assets/original-edbc9b1a905204e54ac50ca36215712a.webp'
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const { searchValue, setAntdSearchClick } = useAppContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchDetails, setSearchDetails] = useState<ListProductDetails[]>([]);
    const navigate = useNavigate();

    const fetchSearchResult = useCallback(async (title: string, signal?: AbortSignal) => {
        try {
            const response = await publicSvc.searchProduct(title, signal)
            setSearchDetails(response.data.data)
        } catch (error) {
            if ((error as any)?.name === 'CanceledError' || (error as any)?.message === 'canceled') {
                // Request was cancelled, ignore
                return
            }
            throw error
        } finally {
            setAntdSearchClick(false)
            setIsLoading(false)
        }
    }, [setAntdSearchClick])

    const handleProductId = (id: string) => {
        try {
            navigate(`/product/${id}`)
        } catch (error) {
            console.log("Something is wrong here.")
            throw error
        }
    }

    useEffect(() => {
        if (searchValue) {
            const controller = new AbortController();
            const timer = setTimeout(() => {
                fetchSearchResult(searchValue, controller.signal);
            }, 2000);

            return () => {
                clearTimeout(timer);
                controller.abort();
            };
        }
    }, [searchValue, fetchSearchResult])

    return (
        isLoading ? '' :
            <>
                <div>
                    <div className="flex flex-col mt-4 gap-5 w-full h-full items-center justify-center">
                        <div className="flex w-full">
                            <div className="flex font-semibold text-2xl">
                                Search Result: {searchValue}
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2 items-center justify-center">
                            {searchDetails.length > 0 ? (
                                searchDetails.map((item) => (
                                    <div key={item._id}
                                        className="flex border-2 w-full rounded-md border-violet-300 mb-4"
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
                        <div className="flex w-full -mt-3 mb-4">
                            <span className="flex border border-t border-gray-700 grow"></span>
                        </div>
                    </div>

                </div>
            </>
    )
}

export default SearchPage