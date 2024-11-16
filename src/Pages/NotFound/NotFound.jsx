import React from 'react';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageNotFound from "../../Assets/PageNotFound.jpg"
import { Empty, Typography } from 'antd';

const NotFound = () => {

    const data = useSelector(detail => detail.authentication)

    const userAuthentication = data.token ? true : false;

    const path = userAuthentication ? "/dashboard" : "/"

    return (
        <>
            <Empty
                className='notFound'
                image={PageNotFound}
                imageStyle={{
                    height: 200,
                }}
                description={
                    <Typography.Text >
                        <p>No Data Found</p>
                    </Typography.Text>
                }
            >
                <Link to={path} className='naviagateText'>{userAuthentication ? <>Dashboard</> : <>Login</>}</Link>
            </Empty>
        </>
    )
}

export default NotFound;
