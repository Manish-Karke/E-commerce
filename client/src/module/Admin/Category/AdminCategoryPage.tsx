import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineSmile } from "react-icons/ai";
import AdminCategoryCreatePage from "./AdminCategoryCreatePage";
import { useNavigate } from "react-router-dom";
import AdminCategoryUpdatePage from "./AdminCategoryUpdatePage";
import adminSvc from "../../../service/admin.service";
import type { CategoryResponse } from "../admin.validator";

export interface AdminCategoryProps {
    setAddClick: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminCategoryPage = () => {
    const navigate = useNavigate();
    const isUpdate = location.pathname.includes('update')
    const [addClick, setAddClick] = useState<boolean>(false)
    const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchCategoryList = useCallback(async () => {
        try {
            const response = await adminSvc.listCategory()
            setCategoryList(response)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const deleteCategoryById = useCallback(async (id: string) => {
        await adminSvc.categoryDeleteById(id);
        fetchCategoryList();
    }, [fetchCategoryList])

    useEffect(() => {
        fetchCategoryList()
    }, [location.pathname, addClick])

    return (
        <>
            {!isLoading &&
                <div className="flex flex-col w-full h-full">
                    {isUpdate ?
                        <>
                            <div className="flex flex-col w-full h-full p-4 gap-4 bg-gray-100 rounded-md ">
                                <h2 className="text-2xl header-title">
                                    Update Category
                                </h2>
                                <div className="flex flex-col bg-gray-200 rounded-md p-4 border border-violet-300 ">
                                    <AdminCategoryUpdatePage />
                                </div>
                            </div>
                        </> :
                        <>
                            <div className="flex flex-col w-full h-auto shrink-0 p-4 gap-2 text-xl bg-gray-100 rounded-md">
                                <h2 className="flex header-title text-2xl">
                                    Categories
                                </h2>
                                <div
                                    className={`
                                        flex flex-col text-gray-700 gap-5 border border-violet-200 p-4 rounded-xl w-full h-[38vh] shrink-0 items-center justify-center
                                        ${addClick ? 'visible' : 'hidden'}
                                    `}
                                >

                                    <AdminCategoryCreatePage setAddClick={setAddClick}/>
                                </div>
                            </div>
                            <div className="flex flex-col px-4 pt-2 gap-4">
                                <div className="flex items-center w-full justify-between">
                                    <p className="header-title">
                                        Existing Category
                                    </p>
                                    <div className="text-green-800 font-semibold">
                                        <AiOutlinePlusCircle onClick={() => setAddClick((prev) => !prev)} size={30} className={`${addClick && 'hidden'}`} />
                                        <AiOutlineMinusCircle onClick={() => setAddClick((prev) => !prev)} size={30} className={`${!addClick && 'hidden'}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full h-auto rounded-md gap-2 bg-gray-50 py-2">
                                    {categoryList?.data?.map((items, index) => (
                                        <div key={index}>
                                            <div className="flex gap-2 h-[7vh] w-full shrink-0 items-center justify-between bg-gray-100 p-2 rounded-md">
                                                <p className="flex text-lg">
                                                    {items.name}
                                                </p>
                                                <div className="flex gap-4 text-white">
                                                    <AiOutlineEdit size={30} onClick={() => navigate(`update/${items._id}`)} className="bg-blue-800 rounded-md w-[10vw] h-[10vw] p-2" />
                                                    <AiOutlineDelete size={30} onClick={() => deleteCategoryById(items._id)} className="bg-red-700 rounded-md p-2 w-[10vw] h-[10vw]" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {categoryList?.data.length === 0 && 
                                        <div className="flex gap-2 h-[7vh] w-full shrink-0 items-center justify-center">
                                            <p className="flex text-lg">
                                                No Category Found
                                            </p>
                                            <AiOutlineSmile size={25} />
                                        </div>
                                    }
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default AdminCategoryPage