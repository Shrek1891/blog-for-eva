import {Link} from "react-router-dom";
import avatars from "../utils/avatars";

const Post = ({post, onClick, noAuthor}) => {
    const date = new Date(post.createdDate);
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    return (
        <Link
            onClick={onClick}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
        >
            <img className="avatar-tiny"
                 alt="avatar"
                 src={avatars[post.author.username.trim().toLowerCase()[0]] }/> <strong>{post.title}</strong>{" "}
            <span
                className="text-muted small"
            >{!noAuthor && <>by {post.author.username}</>}{"  "}on{dateFormatted}
            </span>
        </Link>

    )
}

export default Post;