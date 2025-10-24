import LoginForm from "../components/forms-components/LoginForm"
import AntBoxBlack from '../assets/page-img/AntBox-Black.png';

export default function Login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex items-center gap-20">
                <img className="w-60 h-60" src={AntBoxBlack} alt="Ant Box Logo" aria-label="Ant Box Logo" />

                <LoginForm/>
            </div>
        </div>
    )
}