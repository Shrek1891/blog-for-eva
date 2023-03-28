import Container from "./Container";
import {useContext, useEffect} from "react";
import StateContext from "./StateContext";
import {useImmer} from "use-immer";
import axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

import Post from "./Post";

const Home = () => {
    const {user} = useContext(StateContext);
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        isLoading: true,
        feed: []
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`/getHomeFeed`, {
                    token: appState.user.token
                });
                setState(draft => {
                    draft.isLoading = false;
                    draft.feed = response.data;
                });
            } catch (e) {
                console.log(e.response.data);
            }
        }
        fetchData();

    }, []);

    if (state.isLoading) {
        return <LoadingDotsIcon/>
    }
    return (
        <Container title={"Home"} className="container small-container">
            {state.feed.length === 0 && (
                <>
                    <h2 className="text-center">Hello <strong>{user.username}</strong> !!!!</h2>
                    <p className="lead text-muted text-center">Welcome. On this page you can search for topics that interest you,
                        subscribe to other users, and also communicate with them and create your own posts</p>
                </>

            )}

            {state.feed.length > 0 && (
                <>
                    <h2 className="text-center mb-4">The Latest From Those you Follow</h2>
                    <div className="list-group">
                        {state.feed.map((post) => {
                            return <Post post = {post} key = {post._id}/>

                        })}
                    </div>

                </>
            )}

        </Container>
    )
}

export default Home;