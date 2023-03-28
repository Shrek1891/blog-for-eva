import Container from "./Container";
import {useContext, useEffect, useReducer, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import 'react-tooltip/dist/react-tooltip.css'
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import NotFound from "./NotFound";

const EditPost = () => {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const navigate = useNavigate();
    const initialState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false
    }

    const ourReducer = (state, action) => {
        switch (action.type) {
            case "fetchComplete" :
                return {
                    ...state,
                    isFetching: false,
                    title: {
                        value: action.value.title,
                    },
                    body: {
                        value: action.value.body
                    }
                }
            case "titleChange":
                return {
                    ...state,
                    title: {
                        value: action.value,
                        hasErrors: false
                    }
                }
            case "bodyChange":
                return {
                    ...state,
                    body: {
                        value: action.value,
                        hasErrors: false
                    }
                }

            case "submitRequest":
                console.log(state.title)
                if (!state.title.hasErrors && !state.body.hasErrors) {
                    return {
                        ...state,
                        sendCount: state.sendCount++
                    }
                } else {
                    return {...state}
                }


            case "saveRequestStarted":
                return {
                    ...state,
                    isSaving: true,
                }
            case "saveRequestFinished":
                return {
                    ...state,
                    isSaving: false,
                }
            case "titleRules":
                if (!action.value.trim()) {
                    return {
                        ...state,
                        title: {
                            hasErrors: true,
                            message: "You must a title!!"
                        }
                    }
                } else {
                    return {
                        ...state,

                    }
                }
            case "bodyRules":
                if (!action.value.trim()) {
                    return {
                        ...state,
                        body: {
                            hasErrors: true,
                            message: "You must a body content"
                        }
                    }
                } else {
                    return {
                        ...state,

                    }
                }
            case "notFound" :
                return {
                    ...state,
                    notFound: true

                }

            default :
                return {...state}

        }
    }

    const [state, dispatch] = useReducer(ourReducer, initialState);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/post/${state.id}`);
                if (response.data) {
                    dispatch({type: "fetchComplete", value: response.data});
                    if (appState.user.username !== response.data.author.username) {
                        appDispatch({type: "flashMessage", value: "You can`t edit post. It isn`t yours"})
                        navigate(`/post/${appState.user.username}`)
                    }
                } else {
                    dispatch({type: "notFound"})
                }

            } catch (e) {
                console.log(e.response.data)
            }
        };
        fetchPost();

    }, []);

    useEffect(() => {
        if (state.sendCount) {
            dispatch({type: "saveRequestStarted"});
            const fetchPost = async () => {
                try {
                    const response = await axios.post(`/post/${state.id}/edit`, {
                        title: state.title.value,
                        body: state.body.value,
                        token: appState.user.token
                    });
                    dispatch({type: "saveRequestFinished"})
                    appDispatch({type: "flashMessage", value: "Post was update"})
                } catch (e) {
                    console.log(e.response.data)
                }
            };
            fetchPost();
        }


    }, [state.sendCount])
    if (state.notFound) {
        return <NotFound></NotFound>
    }

    if (state.isFetching) {
        return (
            <Container title="loading" className="container small-container"><LoadingDotsIcon/></Container>
        )
    }
    const submitHandle = (e) => {
        e.preventDefault();
        dispatch({type: "submitRequest"});
    }

    return (
        <Container title="Home | Edit Post" className="container small-container">
            <Link to={`/post/${state.id}`} className="small font-weight-bold">&laquo; Back to post permalink</Link>
            <form className="mt-3" onSubmit={submitHandle}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>

                    <input autoFocus name="title"
                           value={state.title.value}
                           onBlur={e => {
                               dispatch({type: "titleRules", value: e.target.value})
                           }

                           }
                           id="post-title"
                           className="form-control form-control-lg form-control-title" type="text" placeholder=""
                           autoComplete="off"
                           onChange={(e) => dispatch({type: "titleChange", value: e.target.value})}
                    />
                    {state.title.hasErrors &&
                        <div className="alert alert-danger small  liveValidateMessage">
                            {state.title.message}
                        </div>
                    }


                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        onBlur={e => dispatch({type: "bodyRules", value: e.target.value})}
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control mb-4"
                        onChange={e => dispatch({type: "bodyChange", value: e.target.value})}
                    ></textarea>
                    {state.body.hasErrors &&
                        <div className="alert alert-danger small  liveValidateMessage">
                            {state.body.message}
                        </div>
                    }
                </div>

                <button
                    className="btn btn-primary convex"
                    type="submit"
                    disabled={state.isSaving}
                >Save Updates
                </button>
            </form>
        </Container>
    )
}

export default EditPost;