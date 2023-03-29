import Footer from "./components/Footer";
import Header from "./components/Header";
import {Route, Routes} from "react-router-dom";
import GuestsPage from "./pages/GuestsPage";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Home from "./components/Home";
import {useEffect, useReducer, useRef, Suspense} from "react";
import React from "react";
import CreatePost from "./components/CreatePost";
import axios from "axios";
//insult
import ViewSinglePost from "./components/ViewSinglePost";

import FlashMessages from "./components/FlashMessages";
import StateContext from "./components/StateContext";
import DispatchContext from "./components/DispatchContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import Search from "./components/Search";
import {CSSTransition} from "react-transition-group";
import Chat from "./components/Chat";
import LoadingDotsIcon from "./components/LoadingDotsIcon";

axios.defaults.baseURL = 'https://back-blog.vercel.app';

function App() {
    const nodeRef = useRef(null);
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexAppToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexAppToken"),
            username: localStorage.getItem("complexAppUsername"),
            avatar: localStorage.getItem("complexAppAvatar"),
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0,
    }
    const ourReducer = (state, action) => {
        switch (action.type) {
            case "login" :
                return {loggedIn: true, flashMessages: state.flashMessages, user: action.data};
            case "logout" :
                return {loggedIn: false, flashMessages: state.flashMessages};
            case "flashMessage" :
                return {...state, flashMessages: state.flashMessages.concat(action.value)};
            case "openSearch":
                return {
                    ...state,
                    isSearchOpen: true,
                }
            case "closeSearch":
                return {
                    ...state,
                    isSearchOpen: false,
                }
            case "toggleChat":
                const tempResult = !state.isChatOpen;
                return {
                    ...state,
                    isChatOpen: tempResult,
                }
            case "closeChat" :
                return {
                    ...state,
                    isChatOpen: false,
                }
            case "incrementUnreadChatCount" :
                const newRes = state.unreadChatCount++;
                return {
                    ...state,
                    unreadChatCount: newRes,
                }
            case "clearUnreadChatCount":
                return {
                    ...state,
                    unreadChatCount: 0,
                }
        }
    }
    const [state, dispatch] = useReducer(ourReducer, initialState);

    useEffect(() => {
        if (state.loggedIn) {
            
            localStorage.setItem("complexAppToken", state.user.token);
            localStorage.setItem("complexAppUsername", state.user.username);
            localStorage.setItem("complexAppAvatar", state.user.avatar);
        } else {
            localStorage.removeItem("complexAppToken");
            localStorage.removeItem("complexAppUsername");
            localStorage.removeItem("complexAppAvatar");
        }

    }, [state.loggedIn]);


    return (

        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <FlashMessages messages={state.flashMessages}/>
                <Header
                />
                <Suspense fallback={<LoadingDotsIcon />}>
                    <Routes>
                        <Route path="/" element={
                            state.loggedIn ? <Home/> : <GuestsPage/>
                        }/>
                        <Route path="/profile/:username/*" element={<Profile/>}/>
                        <Route path="/post/:id" element={<ViewSinglePost/>}/>
                        <Route path="/about-us" element={<About/>}/>
                        <Route path="/terms" element={<Terms/>}/>
                        <Route path="/create-post" element={<CreatePost/>}/>
                        <Route path="/post/:id/edit" element={<EditPost/>}/>

                    </Routes>
                </Suspense>

                <CSSTransition
                    timeout={330}
                    in={state.isSearchOpen}
                    classNames="search-overlay"
                    unmountOnExit

                >
                    <Search/>
                </CSSTransition>
                <Chat/>
                <Footer/>
            </DispatchContext.Provider>
        </StateContext.Provider>


    );
}

export default App;
