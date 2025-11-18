import { useEffect } from "react"
import { useAppContext } from "../../context/AppContext"
import { Outlet, useNavigate } from "react-router-dom"

const AuthenticateUserPage = () => {
    const { loggedInUser } = useAppContext()
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedInUser || loggedInUser === null) {
            navigate('/v1/home')
        } else {
            if (loggedInUser?.role === 'admin') {
                navigate('/admin')
            } else if (loggedInUser?.role === 'seller') {
                navigate('/seller')
            } else {
                navigate('/v1/home')
            }
        }
    }, [loggedInUser])

    return (
        <>
            <Outlet/>
        </>
    )
}

export default AuthenticateUserPage