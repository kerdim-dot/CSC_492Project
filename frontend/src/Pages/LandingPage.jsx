import { Link, useNavigate } from 'react-router-dom'

function LandingPage(){
    return(
    <div>
        <Link to = "/dashboard">
        <button>
        Click Me
        </button>
        </Link>
    </div>
    );
}
export default LandingPage;