import {useContext, useEffect, useRef, useState} from "react";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import {useImmer} from "use-immer";
import io from "socket.io-client";
import {Link} from "react-router-dom";
import avatars from "../utils/avatars";

const socket = io("https://back-blog.vercel.app");

const Chat = () => {
    const chatLog = useRef(null);
    const appChat = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    const [state, setState] = useImmer({
        fieldValue: '',
        chatMessages: [],
        isWriteMessage: false,
    });

    const handleFieldChang = (e) => {
        const value = e.target.value;
        setState(draft => {
            draft.fieldValue = value;
        });
    }


    function handleSubmit(e) {
        e.preventDefault()
        // Send message to chat server
        socket.emit("chatFromBrowser", {message: state.fieldValue, token: appChat.user.token})

        setState((draft) => {
            // Add message to state collection of messages
            draft.chatMessages.push({
                message: draft.fieldValue,
                username: appChat.user.username,
                avatar: appChat.user.avatar
            })
            draft.fieldValue = ""
        })

    }

    const chatField = useRef(null);
    useEffect(() => {
        if (appChat.isChatOpen) {
            chatField.current.focus()
            appDispatch({type: "clearUnreadChatCount"})
        }
    }, [appChat.isChatOpen])
    useEffect(() => {
        socket.on("chatFromServer", (message) => {
            setState((draft) => {
                draft.chatMessages.push(message);
            })
        })

        return () => socket.off("chatFromServer" )
    }, [socket])
    useEffect(() => {
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
        if (state.chatMessages.length && !appChat.isChatOpen) {
            appDispatch({type: "incrementUnreadChatCount"});
        }
    }, [state.chatMessages])
    return (
        <>
            <div id="chat-wrapper"
                 className={"chat-wrapper  shadow border-top border-left border-right " + (appChat.isChatOpen ? "chat-wrapper--is-visible" : "")}>
                <div className="chat-title-bar bg-primary">
                    Chat
                    <span className="chat-title-bar-close" onClick={() => appDispatch({type: "closeChat"})}>
          <i className="bi bi-x-circle"></i>
        </span>
                </div>
                <div id="chat" className="chat-log" ref={chatLog}>
                    {state.chatMessages.map((message, index) => {
                        if (message.username === appChat.user.username) {
                            return (
                                <div className="chat-self" key={index}>
                                    <div className="chat-message">
                                        <div className="chat-message-inner">{message.message}</div>
                                    </div>
                                    <img className="chat-avatar avatar-tiny"
                                         alt="avatar"
                                         src={avatars[message.username.trim().toLowerCase()[0]] }/>
                                </div>
                            )
                        }
                        return (
                            <div className="chat-other" key={index}>
                                <Link to={`/profile/${message.username}`}>
                                    <img className="avatar-tiny"
                                         src={avatars[message.username.trim().toLowerCase()[0]]} alt="avatar"/>
                                </Link>
                                <div className="chat-message">
                                    <div className="chat-message-inner">
                                        <Link to={`/profile/${message.username}`}>
                                            <strong>{message.username} : </strong>
                                        </Link>
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                </div>
                <form
                    id="chatForm"
                    className="chat-form border-top"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={chatField}
                        type="text"
                        className="chat-field"
                        id="chatField"
                        placeholder="Type a message…"
                        autoComplete="off"
                        onChange={handleFieldChang}
                        value={state.fieldValue}
                    />
                </form>
            </div>
        </>
    )
}

export default Chat;