import { Link, useNavigate } from 'react-router-dom'
import '../login_page.css'


function LandingPage(){
    return(
    <div>
        <Link to = "/dashboard">
            <button className = "myButton">
            Login (just goes to Dashboard rn)
            </button>
        </Link>
    </div>
    );
}
export default LandingPage;