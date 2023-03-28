import {useParams, NavLink, Routes, Route} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import StateContext from "./StateContext";
import ProfilePost from "./ProfilePost";
import {useImmer} from "use-immer";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
import avatars from "../utils/avatars";

const Profile = () => {
    const {username} = useParams();
    const appState = useContext(StateContext);
    const [state, setState] = useImmer(
        {
            followActionLoading: false,
            startFollowingRequestCount: 0,
            stopFollowingRequestCount: 0,
            profileData: {
                profileUsername: "...",
                profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
                isFollowing: false,
                counts: {
                    followerCount: 0, followingCount: 0, postCount: 0
                }
            }

        }
    )

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.post(`/profile/${username}`, {
                    token: appState.user.token
                });
                setState(draft => {
                    draft.profileData = response.data;

                });
                setState(draft => {
                    draft.profileData.profileAvatar = avatars[state.profileData.profileUsername.trim().toLowerCase()[0]]
                })
            } catch (e) {
                console.log(e.response.data);
            }
        }
        fetchData();

    }, [username,state.profileData.profileAvatar]);
    useEffect(() => {
        if (state.startFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true;
            })
            const fetchData = async () => {
                try {
                    const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, {
                        token: appState.user.token
                    });
                    setState(draft => {
                        draft.profileData.isFollowing = true;
                        draft.profileData.counts.followerCount++;
                        draft.followActionLoading = false;
                    });
                } catch (e) {
                    console.log(e.response.data);
                }
            }
            fetchData();
        }


    }, [state.startFollowingRequestCount]);
    const startFollowing = () => {
        setState(draft => {
            draft.startFollowingRequestCount++;
        })
    }

    const stopFollowing = () => {
        setState(draft => {
            draft.stopFollowingRequestCount++;
        })
    }

    useEffect(() => {
        if (state.stopFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true;
            })
            const fetchData = async () => {
                try {
                    const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, {
                        token: appState.user.token
                    });
                    setState(draft => {
                        draft.profileData.isFollowing = false;
                        draft.profileData.counts.followerCount--;
                        draft.followActionLoading = false;
                    });
                } catch (e) {
                    console.log(e.response.data);
                }
            }
            fetchData();
        }


    }, [state.stopFollowingRequestCount]);


    return (
        <div className="container small-container">
            <h2 className="mx-2">
                <img className="avatar-small" alt="avatar"
                     src={state.profileData.profileAvatar}/> {state.profileData.profileUsername}
                {appState.loggedIn
                    && !state.profileData.isFollowing
                    && appState.user.username !== state.profileData.profileUsername
                    && state.profileData.profileUsername !== "..."
                    &&
                    (<button
                        onClick={startFollowing}
                        disabled={state.followActionLoading}
                        className="btn btn-primary btn-sm ml-2 mx-2"
                    >Follow <i className="bi bi-person-plus"></i>
                    </button>)
                }
                {appState.loggedIn
                    && state.profileData.isFollowing
                    && appState.user.username !== state.profileData.profileUsername
                    && state.profileData.profileUsername !== "..."
                    &&
                    (<button
                        onClick={stopFollowing}
                        disabled={state.followActionLoading}
                        className="btn btn-danger btn-sm ml-2 mx-2"
                    >Stop Following <i className="bi bi-person-times"></i>
                    </button>)
                }

            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <NavLink to={`/profile/${state.profileData.profileUsername}/profilepost`} className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </NavLink>
                <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>
            <Routes>
                <Route path="/profilepost" element={<ProfilePost/>}/>
                <Route path="/followers" element={<ProfileFollowers/>}/>
                <Route path="/following" element={<ProfileFollowing/>}/>
            </Routes>

        </div>
    )
}
export default Profile;