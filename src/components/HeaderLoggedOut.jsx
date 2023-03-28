import {useContext, useState} from "react";
import axios from "axios";
import context from "../context";
import DispatchContext from "./DispatchContext";

const HeaderLoggedOut = () => {
    const appDispatch = useContext(DispatchContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', {
                username, password
            });
            if (res.data) {

                appDispatch({type: "login", data: res.data});
                appDispatch({type: "flashMessage", value: "You have successfully log in"})

            } else {
                console.log("Incorrect username or password");
                appDispatch({type: "flashMessage", value: "Invalid password or username "})
            }
        } catch (e) {
            console.log(e.response.data);
        }
    }
    return (
        <form
            className="mb-0 pt-2 pt-md-0"
            onSubmit={e => handleSubmit(e)}
        >
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        name="username" className="form-control form-control-sm input-dark box" type="text"
                        placeholder="Username" autoComplete="off"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        name="password"
                        className="form-control form-control-sm input-dark box" type="password"
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm convex">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoggedOut;