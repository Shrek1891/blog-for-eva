import Container from "./Container";
import axios from "axios";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import context from "../context";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const appDispatch = useContext(DispatchContext);
    const {user} = useContext(StateContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/create-post', {
                title,
                body,
                token: user.token

            });
            console.log(user.token);
            appDispatch({type: "flashMessage", value: "Cool, you have new post"})
            navigate(`/post/${response.data}`);

            console.log("success")
        } catch (e) {
            console.log(e.response.data);
        }
    }

    return (
        <Container title="Home | Create Post" className="container small-container">
            <form className="mx-2" onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus name="title" id="post-title"
                           className="form-control form-control-lg form-control-title" type="text" placeholder=""
                           autoComplete="off"
                           onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        onChange={e => setBody(e.target.value)}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control mb-3"
                    ></textarea>
                </div>

                <button className="btn btn-primary convex" type="submit">Save New Post</button>
            </form>
        </Container>
    )
};

export default CreatePost;