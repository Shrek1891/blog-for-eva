import {Link} from "react-router-dom";
import Container from "./Container";

const notFound = () => {
    return (
        <Container title="Not Found" className={"container"}>
            <div className="text-center">
                <h2>Whoops, we cannot find that page</h2>
                <p
                    className="lead text-muted"
                >
                    You can always visit the
                    <Link to="/">homepage</Link>
                    to get fresh start

                </p>
            </div>
        </Container>
    )
}

export default notFound();