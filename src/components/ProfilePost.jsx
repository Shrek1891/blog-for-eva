import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Container from "./Container";
import Post from "./Post";

const ProfilePost = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const {username} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {

                const response = await axios.get(`/profile/${username}/posts`);
                setPosts(response.data);
                setIsLoading(false);
            } catch (e) {
                console.log(e.response.data)
            }
        };
        fetchPosts();
    }, [username])
    if (isLoading) return (
        <LoadingDotsIcon/>
    )
    return (
        <Container className="list-group" title="list of posts">
            {posts.length > 0 && posts.map((post, index) => {
                return <Post
                    post={post}
                    key={post._id}
                    noAuthor={true}
                />

            })}
        </Container>
    )
}

export default ProfilePost;