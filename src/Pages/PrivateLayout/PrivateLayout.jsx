import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { remove } from '../../Redux/Action_Create/ActionCreate';
import privateRoute from '../../Routes/Rotings/PrivateRouting/PrivateRouting';
import vr46 from "../../Assets/vr46.jpg"
import { Button, Layout, Menu, Row, Col, notification, Spin } from 'antd';
import { IoMenuOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { FiUserPlus, FiLogOut } from "react-icons/fi";
import { TbSettings } from "react-icons/tb";

const { Header, Sider, Content } = Layout;


const PrivateLayout = () => {

  const userData = useSelector(detail => detail.authentication);

  const location = useLocation()

  // collapsed used to check whether the slider is collapsed or not
  const [collapsed, setCollapsed] = useState(false);
  const [path, setPath] = useState(location.pathname === "/" ? "/dashboard" : location.pathname);

  const { id: param } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // logoutFunctionality helps to log out the user from the device and delete the user token details, pop the notification and navigate to the login page
  const logoutFunctionality = () => {

    // notification from antd is used to give the notification for logout
    notification.success({
      message: 'Logout Successful',
      description: `Welcome Again`,
    })
    dispatch(remove())
    navigate("/")
  }

  const existedData = (inputs) => {
    // if (userData.token) {
    if (inputs === "email")
      return atob(userData.email);
    else if (inputs === "firstName")
      return atob(userData.first_name);
    else if (inputs === "lastName")
      return atob(userData.last_name);
    else if (inputs === "profileImage")
      return atob(userData.imageurl);
    else
      return ""

  }

  useEffect(() => {
    navigate(path)
    // eslint-disable-next-line
  }, [setPath])

  useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname, param])

  return (
    <>
      <Layout className='backgroundBlack'>
        <Sider trigger={null} collapsible collapsed={collapsed} width={310} className='sider'>

          <Col className='layoutAlign'>
            <Row className='layoutAlignContent'>
              <Row>
                <Col span={24}>
                  <Row >
                    <Col span={24}>
                      <div className="logo-vertical" >
                        {!collapsed ?
                          <Row align={'middle'}>
                            <Col span={1}></Col>
                            <Col span={5}>
                              <img src={vr46} alt="vr46" width={60} height={60} className='boradImage' />
                            </Col>
                            <Col span={13}>
                              <Row>
                                <Col span={24}>
                                  <Row className='adminName' ><b>{existedData("firstName")} {existedData("lastName")}</b></Row>
                                  <Row className='adminEmail'><u><a href={`mailto:${existedData("email")}`} className='boardNavi' title={existedData("email")}>{existedData("email")}</a></u></Row>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={3}>
                              <Button
                                type="text"
                                icon={<IoMenuOutline size={45} />}
                                size='large'
                                onClick={() => setCollapsed(!collapsed)}
                              />
                            </Col>
                            <Col span={1}></Col>
                          </Row>
                          :
                          <Row justify={'center'}>
                            <Button
                              type="text"
                              icon={<IoMenuOutline size={45} />}
                              size='large'
                              onClick={() => setCollapsed(!collapsed)}
                            />
                          </Row>
                        }
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={1}></Col>
                    <Col span={22}>
                      <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[location.pathname]}
                        selectedKeys={[location.pathname]}

                        onClick={(val) => {
                          setPath(val.key)
                          setTimeout(() => navigate(val.key), 1000)
                        }
                        }
                        items={[
                          {
                            key: '/dashboard',
                            icon: <RxDashboard />,
                            label: 'Dashboard',
                          },
                          {
                            key: '/adduser',
                            icon: <FiUserPlus />,
                            label: 'Add User',
                          },
                          {
                            key: '/setting',
                            icon: <TbSettings />,
                            label: 'Settings',
                            className: "disableMenu",
                            disabled: true
                          },
                        ]}
                      />
                    </Col>
                    <Col span={1}></Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={22}>
                  <Row className='btnPrivateLayout'>
                    {!collapsed ?
                      <Button type="primary" htmlType='submit' block className='btn btnLogout' icon={<FiLogOut size={20} className='logOutIcon' />} onClick={() => logoutFunctionality()}> Logout</Button>
                      : <Button
                        theme="dark"
                        type="submit"
                        icon={<FiLogOut size={20} />}
                        block
                        className='btn'
                        size="large"
                        onClick={() => logoutFunctionality()}
                      />}
                  </Row>
                </Col>
                <Col span={1}></Col>
              </Row>
            </Row>
            <Row className='slideBarbottom'></Row>
          </Col>
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0.6%",
              background: "#181818",
              minHeight: "8.32vh",
              fontSize: "30px"
            }}
            className='header'
          >
            {location.pathname === "/dashboard" ? <>DASHBOARD</> :
              location.pathname === "/adduser" ? <>ADD USER</> :
                location.pathname === "/setting" ? <>SETTING</> : <>EDIT USER</>}
          </Header>

          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280
            }}
            className='contentPrivateLayout'
          >
            <Routes>
              {privateRoute.map((route, index) => {
                let Component = route.component;
                return (
                  <Route
                    key={`route-${index}`}
                    path={route.path}
                    element={
                      <Suspense
                        fallback={
                          <Row
                            justify="center"
                            style={{ lineHeight: "697px" }}
                          >
                            <Col>
                              <Spin size="large" />
                            </Col>
                          </Row>
                        }
                      >
                        <Component />
                      </Suspense>
                    }
                  />
                );
              })}
            </Routes>

          </Content>

        </Layout>
      </Layout>
    </>
  );
};
export default PrivateLayout;