import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Container from "./Container";
import avatars from "../utils/avatars";

const ProfileFollowing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const {username} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {

                const response = await axios.get(`/profile/${username}/following`);
                setFollowers(response.data);
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
        <Container className="list-group small-container" title="list of following">
            {followers.map((follower, index) => {
                return (
                    <Link
                        to={`/profile/${follower.username}`}
                        className="list-group-item list-group-item-action"
                        key={index}
                    >
                        <img className="avatar-tiny"
                             alt="avatar"
                             src={avatars[follower.username.trim().toLowerCase()[0]] }/>
                        {"  " + follower.username}
                    </Link>
                )

            })}
        </Container>
    )
}

export default ProfileFollowing;