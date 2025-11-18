import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { CartValidationDTO } from "./customer.validator"

const CustomerAddToCartPage = () => {
    const vh = window.innerHeight
    const vw = window.innerWidth

    const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            items: {
                quantity: 1
            },
            coupon: ''
        }, 
        resolver: yupResolver(CartValidationDTO)
    })

    const onSubmit = () => {

    }

    return (
        <>
            <div className="flex flex-col shrink-0 h-full w-full p-2 bg-amber-500">
                <h2>
                    Product name
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full h-full shrink-0">
                    <div className="flex bg-gray-50 w-full h-full shirnk-0">
                        jsdflasjdlfaj
                        sd
                        fas
                        df
                    </div>
                </form>
            </div>
        </>
    )
}

export default CustomerAddToCartPage;