import {useEffect} from "react";

const Container = ({children, className, title}) => {
    useEffect(() => {
        document.title = title + " | Blog";
        window.scrollTo(0, 0);
    }, [])
    return (
        <div className={className}>{children}</div>
    )
}

export default Container;