import {useContext, useEffect} from "react";
import DispatchContext from "./DispatchContext";
import {useImmer} from "use-immer";
import axios from "axios";
import {Link} from "react-router-dom";
import Post from "./Post";

const Search = () => {
    const addDispatch = useContext(DispatchContext);

    const [state, setState] = useImmer({
        searchTerm: '',
        results: [],
        show: "neither",
        requestCount: 0
    })
    const searchKeyPressHandler = (e) => {
        if (e.keyCode === 27) {
            addDispatch({type: "closeSearch"})
        }
    }
    useEffect(() => {
        if (state.requestCount) {
            const fetchResults = async () => {
                const ourRequest = axios.CancelToken.source();
                try {
                    const response = await axios.post(`/search`, {
                        searchTerm: state.searchTerm
                    }, {
                        cancelToken: ourRequest.token
                    });
                    setState(draft => {
                        draft.results = response.data;
                        draft.show = "results";
                    });
                } catch (e) {
                    console.log(e.response.data)
                }
            };
            fetchResults();

        }
    }, [state.requestCount])


    useEffect(() => {
        document.addEventListener("keyup", searchKeyPressHandler);
        return () => document.removeEventListener("keyup", searchKeyPressHandler)
    }, []);
    useEffect(() => {

        if (state.searchTerm.trim()) {
            setState(draft => {
                draft.show = 'loading'
            })
            const delay = setTimeout(() => {
                setState(draft => {
                    draft.requestCount++;
                })
                return () => {
                    clearTimeout(delay);
                }
            }, 500);
        } else {
            setState(draft => {
                draft.show = 'neither'
            })
        }


    }, [state.searchTerm]);

    const handleInput = (e) => {
        const value = e.target.value;
        setState(draft => {
            draft.searchTerm = value;
        })
    }
    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label htmlFor="live-search-field" className="search-overlay-icon">
                        <i className="bi bi-search-heart"></i>
                    </label>
                    <input
                        onChange={handleInput}
                        autoFocus
                        type="text"
                        autoComplete="off"
                        id="live-search-field"
                        className="live-search-field text-center"
                        placeholder="What are you interested in?"
                    />
                    <span className="close-live-search">
            <i
                className="bi bi-x-octagon-fill"
                onClick={() => addDispatch({type: "closeSearch"})}
            ></i>
          </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div
                        className={"circle-loader " + (state.show === "loading" ? 'circle-loader--visible' : '')}></div>

                    <div
                        className={"live-search-results" + (state.show === "results" ? "live-search--visible" : "")}
                    >
                        {Boolean(state.results.length) && <div className="list-group shadow-sm">
                            <div className="list-group-item active"><strong>Search
                                Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                            </div>
                            {state.results.map((post) => {
                                return <Post
                                    post={post}
                                    key={post._id}
                                    onClick={() => addDispatch({type: "closeSearch"})}
                                />

                            })}
                        </div>}
                        {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm ">
                            Sory, we could not find any result
                        </p>}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;