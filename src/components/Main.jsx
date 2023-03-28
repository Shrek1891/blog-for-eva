import Header from "./Header";
import Container from "./Container";
import axios from "axios";
import {useContext, useEffect, useRef, useState} from "react";
import {useImmerReducer} from "use-immer";
import {CSSTransition} from "react-transition-group";
import DispatchContext from "./DispatchContext";


const Main = () => {
    const appDispatch = useContext(DispatchContext);
    const nodeRef = useRef(null);
    const nodePassRef = useRef(null);
    const nodeEmailRef = useRef(null);
    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        password: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0
    }
    const ourReducer = (draft, action) => {
        switch (action.type) {
            case "usernameImmediately":
                draft.username.hasErrors = false;
                draft.username.value = action.value;
                if (draft.username.value.length > 30) {
                    draft.username.hasErrors = true;
                    draft.username.message = " Username cannot exceed 30 characters"
                }
                if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
                    draft.username.hasErrors = true
                    draft.username.message = "Username can contains latin letters or numbers"
                }
                return
            case "usernameAfterDelay":
                if (draft.username.value.length < 3) {
                    draft.username.hasErrors = true;
                    draft.username.message = "Username must be at least 3 characters "
                }
                if (!draft.hasErrors && !action.noRequest) {
                    draft.username.checkCount++;
                }

                return;
            case "usernameUniqueResults":
                if (action.value) {
                    draft.username.hasErrors = true;
                    draft.username.isUnique = false;
                    draft.username.message = "That user is already taken "
                } else {
                    draft.username.isUnique = true;
                }
                return;
            case "emailImmediately":
                draft.email.hasErrors = false;
                draft.email.value = action.value;
                return;
            case "emailAfterDelay":
                if (!/^\S+@\S+$/.test(draft.email.value)) {

                    draft.email.hasErrors = true;
                    draft.email.message = "You must provide a valid email address";

                }
                if (!draft.email.hasErrors && !action.noRequest) {
                    draft.email.checkCount++;
                }
                return;
            case "emailUniqueResults":
                if (action.value) {
                    draft.email.hasErrors = true;
                    draft.email.isUnique = false;
                    draft.email.message = " That email is already be using"
                } else {
                    draft.email.isUnique = true;
                }
                return;
            case "passwordImmediately":
                draft.password.hasErrors = false;
                draft.password.value = action.value;
                if (draft.password.value.length > 50) {
                    draft.password.hasErrors = true;
                    draft.password.message = "Password cannot exceed 50 characters"
                }
                return
            case "passwordAfterDelay":
                if (draft.password.value.length < 12) {
                    draft.password.hasErrors = true;
                    draft.password.message = "Password must be at least 12 characters"

                }
                return;
            case "submitForm" :
                if (!draft.username.hasErrors
                    && draft.username.isUnique
                    && !draft.email.hasErrors
                    && draft.email.isUnique
                    && !draft.password.hasErrors
                ) {
                    draft.submitCount++;
                }
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({type: "usernameImmediately", value: state.username.value});
        dispatch({type: "usernameAfterDelay", value: state.username.value, noRequest: true});
        dispatch({type: "emailImmediately", value: state.email.value});
        dispatch({type: "emailAfterDelay", value: state.email.value, noRequest: true});
        dispatch({type: "passwordImmediately", value: state.password.value});
        dispatch({type: "passwordAfterDelay", value: state.password.value});
        dispatch({type: "submitForm"})

    }

    useEffect(() => {
        if (state.username.value) {
            const delay = setTimeout(() => dispatch({type: "usernameAfterDelay"}), 800);
            return () => clearTimeout(delay);
        }
    }, [state.username.value]);

    useEffect(() => {
        if (state.email.value) {
            const delay = setTimeout(() => {
                dispatch({type: "emailAfterDelay"})

            }, 800);

            return () => {
                clearTimeout(delay)

            };
        }
    }, [state.email.value]);

    useEffect(() => {
        if (state.password.value) {
            const delay = setTimeout(() => dispatch({type: "passwordAfterDelay"}), 800);
            return () => clearTimeout(delay);
        }
    }, [state.password.value]);
    useEffect(() => {
        if (state.username.checkCount) {
            const fetchResults = async () => {
                const ourRequest = axios.CancelToken.source();
                try {
                    const response = await axios.post(`/doesUsernameExist`, {
                        username: state.username.value
                    }, {
                        cancelToken: ourRequest.token
                    });
                    dispatch({type: "usernameUniqueResults", value: response.data})

                } catch (e) {
                    console.log(e.response.data)
                }
            };
            fetchResults();

        }
    }, [state.username.checkCount])

    useEffect(() => {
        if (state.email.checkCount) {
            const fetchResults = async () => {
                const ourRequest = axios.CancelToken.source();
                try {
                    const response = await axios.post(`/doesEmailExist`, {
                        email: state.email.value
                    }, {
                        cancelToken: ourRequest.token
                    });
                    dispatch({type: "emailUniqueResults", value: response.data})

                } catch (e) {
                    console.log(e.response.data)
                }
            };
            fetchResults();

        }
    }, [state.email.checkCount])

    useEffect(() => {
        if (state.submitCount) {
            const fetchResults = async () => {
                const ourRequest = axios.CancelToken.source();
                try {
                    const response = await axios.post(`/register`, {
                        username: state.username.value,
                        email: state.email.value,
                        password: state.password.value,
                    }, {
                        cancelToken: ourRequest.token
                    });
                    appDispatch({type: "login", data: response.data});
                    appDispatch({type: "flashMessage", value: "Congrats! Welcome!!" })

                } catch (e) {
                    console.log(e.response.data)
                }
            };
            fetchResults();

        }
    }, [state.submitCount])

    return (
        <Container
            className="container py-md-1 main-container"
            title="Guests Page"
        >
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">Share your ideas, thoughts and exciting stories,
                        impressions. Find like-minded people all over the world.</p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label
                                htmlFor="username-register"
                                className="text-muted mb-2">
                                <small>Username</small>
                            </label>
                            <CSSTransition
                                nodeRef={nodeRef}
                                in={state.username.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div
                                    ref={nodeRef}
                                    className="alert alert-danger small liveValidateMessage">
                                    {state.username.message}
                                </div>
                            </CSSTransition>
                            <input
                                id="username-register"
                                name="username"
                                className="form-control box mb-2"
                                type="text"
                                placeholder="Pick a username"
                                autoComplete="off"
                                onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})}
                            />

                        </div>
                        <div className="form-group">
                            <label htmlFor="email-register" className="text-muted mb-2">
                                <small>Email</small>
                            </label>
                            <input
                                id="email-register"
                                name="email"
                                className="form-control box mb-2"
                                type="text"
                                onChange={e => dispatch({type: "emailImmediately", value: e.target.value})}
                                placeholder="you@example.com"
                                autoComplete="off"/>
                            <CSSTransition
                                nodeRef={nodeEmailRef}
                                in={state.email.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div
                                    ref={nodeEmailRef}
                                    className="alert alert-danger small liveValidateMessage">
                                    {state.email.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-register" className="text-muted mb-2">
                                <small>Password</small>
                            </label>
                            <input
                                id="password-register"
                                name="password"
                                className="form-control box mb-2"
                                type="password"
                                placeholder="Create a password"
                                onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})}
                            />
                            <CSSTransition
                                nodeRef={nodePassRef}
                                in={state.password.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div
                                    ref={nodePassRef}
                                    className="alert alert-danger small liveValidateMessage">
                                    {state.password.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block convex">
                            Sign up for Blog
                        </button>
                    </form>
                </div>
            </div>
        </Container>
    )
}

export default Main;