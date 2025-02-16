import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('user_id');
        Cookies.remove('access_token');
        navigate("/login");
    };

    return { handleLogout };
};

export default useAuth;