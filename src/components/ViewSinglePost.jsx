import Container from "./Container";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import 'react-tooltip/dist/react-tooltip.css'
import NotFound from "./NotFound";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import avatars from "../utils/avatars";

const ViewSinglePost = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    const date = new Date(post.createdDate);
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/post/${id}`, {
                    cancelToken: ourRequest.token
                });
                setPost(response.data);
                setIsLoading(false);
            } catch (e) {
                console.log(e.response.data)
            }
        };
        fetchPost();

    }, [id]);

    if (!isLoading && !post) {
        return <NotFound/>
    }

    if (isLoading) {
        return (
            <Container title="loading" className="container small-container"><LoadingDotsIcon/></Container>
        )
    }
    const isOwner = () => {
        if (appState.loggedIn) {
            return appState.user.username === post.author.username;
        }
        return false;
    }
    const deleteHandler = async () => {
        const areYouSure = window.confirm("Do you really want delete this post?");
        if (areYouSure) {
            try {
                const response = await axios.delete(`/post/${id}`, {
                    data: {
                        token: appState.user.token
                    }
                });
                if (response.data === "Success") {
                    appDispatch({type: "flashMessage", value: "Post was successfully deleted"});
                    navigate(`/profile/${appState.user.username}`)

                }
            } catch (e) {
                console.log(e.response.data)
            }
        }
    }

    return (
        <Container title="Post" className="container small-container">
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                <Link
                    to={`/post/${post._id}/edit`}
                    data-tooltip-tip="edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="top"
                    className="text-primary mx-2"
                    title="Edit"

                >
              <i className="bi bi-pencil-square"></i>
          </Link>
          <a
              className="delete-post-button text-danger mx-2"
              title="Delete"
              onClick={deleteHandler}
          >
              <i className="bi bi-trash-fill"></i></a>
        </span>
                )}

            </div>

            <p className="text-muted small mb-4">
                <a href="#">
                    <img className="avatar-tiny"
                         alt="avatar"
                         src={avatars[post.author.username.trim().toLowerCase()[0]]}/>
                </a>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.body}
                </ReactMarkdown>
            </div>
        </Container>
    )
}

export default ViewSinglePost;