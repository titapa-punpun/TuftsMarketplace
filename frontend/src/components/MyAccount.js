import React from 'react';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";


class MyAccount extends React.Component {
    render() {
        return (
            <div>
                <h1>My Account</h1>
                <div style={{display: 'flex', width: 500, justifyContent: 'space-between'}}>
                    <Link to={"/myAccount/myListings"}>
                        <Button size="large" variant="outlined">
                            My Listings
                        </Button>
                    </Link>
                    <Link to={"/myAccount/orderHistory"}>
                        <Button size="large" variant="outlined">
                            Order History
                        </Button>
                    </Link>
                    <Link to={"/myAccount/archives"}>
                        <Button size="large" variant="outlined">
                            Archives
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default MyAccount