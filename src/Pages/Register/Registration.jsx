import { Button, Form, Input, Row, Col, notification } from 'antd';
import SignInNavigations from '../../Routes/Navigations/Links/signInNavigations';
import { useNavigate } from 'react-router-dom';

const Registration = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    // onSubmit function checks the Api whether the input user details are statisfied to register or not.
    const onSubmit = (values) => {
        // async await function used to post the data to the API 
        (async () => {
            const rawResponse = await fetch('https://admin-app-bdsu.onrender.com/api/v1/admin/new', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name: values.firstName, last_name: values.lastName, email: values.email, password: values.password })
            });

            // In content we store the response of the API 
            const content = await rawResponse.json();

            // If registration was successful it shows the success notification and navigate to the login page
            if (content.success) {
                notification.success({
                    message: 'Registration Successful',
                    description: `${content.message}`,
                });
                form.resetFields();
                // we are delaying the 0.5 sec to navigate
                setTimeout(() => navigate("/"), 1000)
            }
            else {

                if (content.error.message.includes("ER_DUP_ENTRY")) {
                    notification.error({
                        message: 'Registration Failed',
                        description: "User Already Exist",
                    });
                    // setTimeout(() => navigate("/"), 500)
                }
                else {
                    notification.error({
                        message: 'Registration Failed',
                        description: `${content.error.message}`,
                    });
                }

            }
        })();
    }

    return (
        <>
            <Col span={24} className='backgroundBlack'>
                <Row className='topRegMargin'></Row>
                <Row>
                    <Col span={1} className='leftRegMargin'>
                    </Col>
                    <Col span={22} className='regContent'>
                        <Row justify={'center'}>
                            <Col className='formTitle'>REGISTER</Col>
                        </Row>

                        <Form
                            form={form}
                            method="post"
                            name="validateOnly"
                            layout="vertical"
                            size={"large"}
                            autoComplete="off"
                            onFinish={(Values) => onSubmit(Values)}
                        >
                            <Row>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"

                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your first name !"
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={7}></Col>
                            </Row>
                            <Row>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your last name !"
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={7}></Col>
                            </Row>

                            <Row>
                                <Col span={7}></Col>
                                <Col span={10}>
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

                                <Col span={7}></Col>
                            </Row>

                            <Row>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter password !',
                                            },
                                            { min: 8, message: 'Password must have a minimum length of 8.' },
                                            {
                                                pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
                                                message: 'Password must contain at least one lowercase letter, uppercase letter, number, and special chracter'
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>

                                <Col span={7}></Col>
                            </Row>

                            <Row>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    <Form.Item
                                        name="confirm"
                                        label="Confirm Password"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter confirm password !',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>

                                <Col span={7}></Col>
                            </Row>

                            <Row className='buttonAlign'>
                                <Col span={7}></Col>
                                <Col span={10}>
                                    <Form.Item >
                                        <Button type="primary" htmlType='submit' block className='btn'>Submit</Button>
                                    </Form.Item>
                                </Col>

                                <Col span={7}></Col>
                            </Row>

                            <Row className='bottomAlign'>
                                <Col span={10}></Col>
                                <Col span={4}>
                                    <Row justify={'center'}>
                                        Already havean account?<SignInNavigations />
                                    </Row>

                                </Col>
                                <Col span={10}></Col>
                            </Row>
                        </Form>

                    </Col>
                    <Col span={1} className='rightRegMargin'></Col>
                </Row>
                <Row className='bottomRegMargin'></Row>
            </Col>
        </>
    )
}

export default Registration;