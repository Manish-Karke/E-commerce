import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "../module/HomePage/HomePage"
import HomePageLayout from "../module/HomePage/Layout/HomePageLayout"
import ProductViewLayout from "../module/ProductPage/Layout/ProductViewLayout"
import ProductViewPage from "../module/ProductPage/ProductViewPage"
import AuthLayoutPage from "../module/AuthPage/Layout/AuthLayoutPage"
import LoginPage from "../module/AuthPage/LoginPage"
import RegisterPage from "../module/AuthPage/RegisterPage"
import ForgetPassword from "../module/AuthPage/ForgetPassword"
import ResetPassword from "../module/AuthPage/ResetPassword"
import AdminLayoutPage from "../module/Admin/Layout/AdminLayoutPages"
import AdminCategoryPage from "../module/Admin/Category/AdminCategoryPage"
import AdminBannerPage from "../module/Admin/Banner/AdminBannerPage"
import AdminCategoryUpdatePage from "../module/Admin/Category/AdminCategoryUpdatePage"
import AdminBannerUpdatePage from "../module/Admin/Banner/AdminBannerUpdatePage"
import AdminProductPage from "../module/Admin/Product/AdminProductPage"
import AdminCouponUpdatePage from "../module/Admin/Coupon/AdminCouponUpdatePage"
import AdminCouponPage from "../module/Admin/Coupon/AdminCouponPage"
import AdminUserPage from "../module/Admin/AdminUsersPage"
import AdminDashboardPage from "../module/Admin/AdminDashboardPage"
import AdminUserViewPage from "../module/Admin/AdminUserViewPage"
import AuthenticateUserPage from "../module/AuthPage/AuthenticateUserPage"
import AdminBannerCreatePage from "../module/Admin/Banner/AdminBannerCreatePage"
import SellerLayoutPage from "../module/Seller/Layout/SellerLayoutPage"
import SellerPage from "../module/Seller/SellerPage"
import SellerUpdatePage from "../module/Seller/SellerUpdatePage"
import SellerProductViewPage from "../module/Seller/SellerProductViewPage"
import SellerDashboardPage from "../module/Seller/SellerDashboardPage"
import SellerViewCategoryPage from "../module/Seller/SellerViewCategory"
import CustomerCartPage from "../module/Cusomter/Cart/CustomerCartPage"

const router = createBrowserRouter([
    {
        path: '/', Component: AuthenticateUserPage, children: [
            {
                path: '/v1', Component: HomePageLayout, children: [
                    { index: true, Component: HomePage },
                    { path: 'home', Component: HomePage },
                    {
                        path: 'product/:id', Component: ProductViewLayout, children: [
                            { index: true, Component: ProductViewPage },
                        ]
                    },
                ], 
            },
            {path: 'customer/cart', Component: CustomerCartPage},
            {
                path: '/auth', Component: AuthLayoutPage, children: [
                    { path: 'login', Component: LoginPage },
                    { path: 'register', Component: RegisterPage },
                    { path: 'forget-password', Component: ForgetPassword },
                    { path: 'reset-password', Component: ResetPassword }
                ],
            },
            {
                path: '/admin', Component: AdminLayoutPage, children: [
                    {
                        index: true, Component: AdminDashboardPage
                    },
                    {
                        path: 'category', Component: AdminCategoryPage, children: [
                            { path: 'update/:id', Component: AdminCategoryUpdatePage }
                        ]
                    },
                    {
                        path: 'banner', Component: AdminBannerPage, children: [
                            { path: 'create', Component: AdminBannerCreatePage },
                            { path: 'update/:id', Component: AdminBannerUpdatePage }
                        ]
                    },
                    { path: 'product', Component: AdminProductPage },
                    {
                        path: 'coupon', Component: AdminCouponPage, children: [
                            { path: 'update/:id', Component: AdminCouponUpdatePage }
                        ]
                    },
                    {
                        path: 'users', Component: AdminUserPage, children: [
                            { path: 'view/:id', Component: AdminUserViewPage }
                        ]
                    }
                ]
            },
            {
                path: '/seller', Component: SellerLayoutPage, children: [
                    { index: true, Component: SellerDashboardPage },
                    { path: 'category/view', Component: SellerViewCategoryPage },
                    {
                        path: 'product', Component: SellerPage, children: [
                            { path: 'update/:id', Component: SellerUpdatePage },
                            { path: 'view/:id', Component: SellerProductViewPage }
                        ]
                    },
                ],
            },
        ]
    },
])

const RouterConfig = () => {
    return <RouterProvider router={router} />
}

export default RouterConfig