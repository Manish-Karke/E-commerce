import * as yup from 'yup'

export interface cartValidationProps {
    items: {
        quantity: number
    },
    coupon: string,
}

export const CartValidationDTO = yup.object().shape({
    items: yup.object().shape({
        quantity: yup.number().required(),
    }),
    coupon: yup.string().nullable()
}) 