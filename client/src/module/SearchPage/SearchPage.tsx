import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext"
import publicSvc from "../../service/public.service";
import type { ListProductDetails } from "../HomePage/homepage.validation";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";

const SearchPage = () => {
    const { searchValue, setAntdSearchClick, loggedInUser, setSearchClick, setSearchValue } = useAppContext();
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
            navigate(`/v1/product/${id}`)
            setSearchValue('')
            setSearchClick(false)
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
        <>
            {!isLoading &&
                <div>
                    <div className="flex flex-col mt-4 gap-4 w-full h-full items-center justify-center">
                        <div className="flex w-full">
                            <div className="flex font-semibold text-2xl px-5 underline w-full h-[5vh] items-center md:-mt-8">
                                Search Result: {searchValue}
                            </div>
                        </div>
                        <div className="flex flex-col w-[90vw] h-auto gap-5 px-3 shrink-0 md:w-full md:grid md:grid-cols-2">
                            {searchDetails.length > 0 ? (
                                searchDetails.map((item) => (
                                    <div key={item._id}
                                        className="flex border-2 w-full h-full border-violet-300 shrink-0 rounded-md items-center justify-center"
                                        onClick={() => handleProductId(item._id)}
                                    >
                                        <div className="flex flex-col w-90 h-[50vh] gap-2 rounded-xl relative">
                                            <div className="flex w-full h-full place-items-center">
                                                <img src={item.images[0]?.secure_url} className="rounded-xl w-auto h-full" alt="dress-01" />
                                            </div>
                                            <div className="absolute top-2 w-full bg-gray-100 flex flex-col gap-2 text-xl px-10 rounded-xl font-semibold text-black h-auto overflow-hidden z-2 p-2">
                                                <h2>
                                                    {item.title}
                                                </h2>
                                            </div>
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-[50vw] items-center justify-center z-2 ">
                                                {loggedInUser?.role === 'admin' || loggedInUser?.role === 'seller' ?
                                                    <div className="flex w-full border-amber-500 bg-amber-500 border-2 text-xl md:w-80 rounded-xl p-2 font-semibold items-center justify-center text-white">
                                                        <h2>
                                                            Qty: {item.stock}
                                                        </h2>
                                                    </div> :
                                                    <button className="flex w-full border-amber-500 bg-amber-500 border-2 text-xl md:w-80 rounded-xl p-2 font-semibold items-center justify-center text-white">
                                                        Add To Cart
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))) : (
                                <div className="w-auto h-[35vh] flex items-center justify-center">
                                    <Empty />
                                </div>
                            )}
                        </div>
                        <div className="flex w-full mt-3 p-2 mb-4">

                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default SearchPage