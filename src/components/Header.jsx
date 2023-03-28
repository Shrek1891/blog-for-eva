import {Link} from "react-router-dom";
import Container from "./Container";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import {useContext, useState} from "react";
import context from "../context";
import StateContext from "./StateContext";

const Header = () => {
    const {loggedIn,user} = useContext(StateContext);
    return (
        <header
            className="header-bar  mb-3 gradient"
        >
            <Container className="container d-flex flex-column flex-md-row align-items-center p-3 justify-content-between ">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link to="/" className="text-white">
                        Blog
                    </Link>
                </h4>
                {loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut /> }
            </Container>
        </header>
    )
}

export default Header;