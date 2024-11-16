import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import ForgotPwdNavigations from '../../Routes/Navigations/Links/forgetPwdNavigations';
import SingUpNavigation from '../../Routes/Navigations/Links/singUpNavigation';
import { fetchAPI } from '../../Redux/Action_Create/ActionCreate';
import { Button, Form, Input, Row, Col } from 'antd';


const Login = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    // useDispatch hook is used to update the details in the Store by calling the method in the ActionCreate file.
    const dispatch = useDispatch();

    const onSubmit = (values) => {
        dispatch(fetchAPI(values, navigate));
    }

    return (
        <>
            <Col span={24} className='backgroundBlack'>
                <Row className="topMargin">
                </Row>
                <Row>
                    <Col className="leftMargin" span={8}></Col>
                    <Col span={8} className='content'>
                        <Row justify={'center'}>
                            <Col className='formTitle'>LOGIN</Col>
                        </Row>
                        <Form
                            form={form}
                            method="post"
                            name="field_a"
                            layout="vertical"
                            size={"large"}
                            autoComplete="off"
                            onFinish={(Values) => onSubmit(Values)}
                        >
                            <Row>
                                <Col span={4}></Col>
                                <Col span={16}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please enter your email !',
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={4}></Col>
                            </Row>

                            <Row>
                                <Col span={4}></Col>
                                <Col span={16}>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        className='inputContinue'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter password !',
                                            },
                                            {
                                                min: 8,
                                                message: 'Please enter valid password'
                                            }
                                        ]}
                                        // hasFeedback
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <Row className='links' justify={'end'} style={{paddingBottom:10}}>
                                        <ForgotPwdNavigations />
                                    </Row>
                                </Col>
                                <Col span={4}></Col>
                            </Row>

                            <Row className="btns">
                                <Col span={4}></Col>
                                <Col span={16}>
                                    <Form.Item >
                                        <Button type="primary" htmlType='submit' block className='btn'>Submit</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={4}></Col>

                            </Row>

                            <Row className='bottomAlign'>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    Don't have an account?<SingUpNavigation />
                                </Col>
                                <Col span={7}></Col>
                            </Row>

                        </Form>
                    </Col>
                    <Col className="rightMargin" span={8}></Col>
                </Row>
                <Row className="bottomMargin"></Row>
            </Col>
        </>
    )

}

export default Login