import {Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import {Tooltip} from 'react-tooltip'
import avatars from "../utils/avatars";


const HeaderLoggedIn = () => {
    const {user, unreadChatCount} = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const navigate = useNavigate();

    function handleLogout() {
        appDispatch({type: "logout"});
        navigate("/");
        appDispatch({type: "flashMessage", value: "You have successfully log out"})

    }

    const handleSearchIcon = (e) => {
        e.preventDefault();
        appDispatch({type: "openSearch"})
    }
    return (
        <div className="flex-row my-3 my-md-0">
            <a
                href="#"
                className="text-white mx-2 header-search-icon"
                onClick={handleSearchIcon}
                data-tooltip-id="search"
                data-tooltip-content="Search"
                data-tooltip-place="bottom"
            >
                <i className="bi bi-search"></i>
            </a>
            <Tooltip id="search" className="custom-tooltip"/>
            <span
                className={"mx-2 header-chat-icon " + (unreadChatCount ? "text-danger" : "text-white")}
                data-tooltip-id="chat"
                data-tooltip-content="Chat"
                data-tooltip-place="bottom"
                onClick={() => appDispatch({type: "toggleChat"})}
            >
                <i className="bi bi-chat-right"></i>
                {unreadChatCount ? <span
                    className="chat-count-badge text-white">{unreadChatCount < 10 ? unreadChatCount : "9+"} </span> : ""}

                <Tooltip id="chat" className="custom-tooltip"/>
          </span>

            <Link
                to={`/profile/${user.username}/profilepost`}
                className="mr-2 mx-2"
                data-tooltip-id="myProfile"
                data-tooltip-content="My profile"
                data-tooltip-place="bottom"
            >
                <img className="small-header-avatar" alt="avatar"
                     src={avatars[user.username.trim().toLowerCase()[0]]}/>
            </Link>
            <Tooltip id="myProfile" className="custom-tooltip"/>
            <Link className="btn btn-sm btn-success mr-2 mx-2 convex" to="/create-post">
                Create Post
            </Link>
            <button
                className="btn btn-sm btn-secondary mx-2 convex"
                onClick={handleLogout}
            >
                Sign Out
            </button>
        </div>

    )
}

export default HeaderLoggedIn;