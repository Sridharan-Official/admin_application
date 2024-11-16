import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Button, Col, Form, Image, Input, Radio, Row, Select, notification } from "antd";


const Adduser = () => {

    const token = useSelector(detail => atob(atob(detail.authentication.token)))

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [uploading, setUploading] = useState();
    const [existedData, setExistedData] = useState({})
    const [uploadPrevent,setUploadPrevent]=useState(false)

    const navigate = useNavigate()

    const { id: urlParam } = useParams();

    const { Option } = Select;

    const handleFileInputChange = async (item) => {

        const files = item.target.files[0];
        const result = await getBase64(files);
        setFileList(result);
        setImageSrc(files);
        setUploadPrevent(false);
        setImageFile();

    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);

        });

    const handleUpload = async () => {

        const formData = new FormData();
        formData.append('file', imageSrc);
        setUploading(true);
        setUploadPrevent(true);


        (async () => {
            const imageApp = await axios.post('https://admin-app-bdsu.onrender.com/image/uploads/',
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            })
            if (imageApp.data.success) {
                setImageFile(imageApp.data.url);
                notification.success({
                    message: 'Upload Successful',
                    description: `${imageApp.data.message}`,
                });
                
            }
            else {
                setImageFile();
                notification.error({
                    message: 'Upload Failed',
                    description: `${imageApp.data.message}`,
                });
                setUploadPrevent(false)
            }
        })();

        setUploading(false);

    };

    const onSubmit = (values) => {

        if (fileList && imageFile) {
            // async await function used to post the data to the API 
            (async () => {
                const rawResponse = await fetch('https://admin-app-bdsu.onrender.com/api/v1/users/new', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...values, imageurl: imageFile })
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
                    setTimeout(() => navigate("/dashboard"), 1000)
                }
                else {

                    if (content.error.message.includes("ER_DUP_ENTRY")) {
                        notification.error({
                            message: 'Registration Failed',
                            description: "User Already Exist",
                        });
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
        else {
            notification.warning({
                message: "Please upload the image"
            })
        }

    }


    const updateFunctionality = (values) => {
        (async () => {
            const rawResponse = await fetch(`https://admin-app-bdsu.onrender.com/api/v1/users/${urlParam}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...values, imageurl: imageFile ? imageFile : values.file })
            });

            // In content we store the response of the API 
            const content = await rawResponse.json();

            // If registration was successful it shows the success notification and navigate to the login page
            if (content.success) {
                notification.success({
                    message: 'Updation Successful',
                    description: `${content.message}`,
                });

                // we are delaying the 1 sec to navigate
                setTimeout(() => navigate("/dashboard"), 1000);
            }
            else {

                if (content.error.message.includes("ER_DUP_ENTRY")) {
                    notification.error({
                        message: 'Registration Failed',
                        description: "User Already Exist",
                    });
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

    const onUpdate = (values) => {
        if (fileList) {
            if (imageFile) {
                updateFunctionality(values);
            }
            else {
                notification.warning({
                    message: "Please upload the image"
                })
            }
        }
        else {
            updateFunctionality(values);
        }


    }

    const selectTagData = {
        country: ["India", "Pakistan", "Japan", "USA"],
        state: ["Tamil Nadu", "Kerala", "Andhra Pradesh", "Karnataka"],
        city: ["Madurai", "Salem", "Bangalore", "Tokyo", "California"]
    }

    useEffect(() => {
        if(urlParam){
            const getUser = async () => {
                await axios.get(`https://admin-app-bdsu.onrender.com/api/v1/users/${urlParam}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(user => {
                        setExistedData(user.data.data[0])
                        const oldUser = user.data.data[0]
                        form.setFieldsValue({
                            first_name: oldUser.first_name,
                            last_name: oldUser.last_name,
                            email: oldUser.email,
                            gender: oldUser.gender,
                            role: oldUser.role,
                            file: oldUser.imageurl,
                            address: oldUser.address,
                            country: oldUser.country,
                            state: oldUser.state,
                            city: oldUser.city
                        })
    
                    })
                    .catch((error) => {
                        console.log("User error -> ",error)
                        setExistedData({});
                        navigate("/notfound")
                    })
            }
    
            getUser();
        }
        // eslint-disable-next-line
    }, [setExistedData])

    useEffect(() => {
        form.resetFields();
        setFileList("");
        // eslint-disable-next-line
    }, [urlParam])

    return (
        <>
            <Col span={24} >
                <Row className="addUserCotent">
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Form
                            form={form}
                            method="post"
                            name="validateOnly"
                            layout="vertical"
                            size={"large"}
                            autoComplete="off"
                            className="addUserForm"
                            onFinish={(Values) => urlParam ? onUpdate(Values) : onSubmit(Values)}
                        >
                            <Row justify={'space-between'} className="addUserRows">
                                <Col span={11}>
                                    <Form.Item
                                        name="first_name"
                                        label="First Name"
                                        className="addUserInput"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your first name !"
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter first name" />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item
                                        name="last_name"
                                        label="Last Name"
                                        className="addUserInput"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your first name !"
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter last name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={'space-between'} className="addUserRows">
                                <Col span={11}>
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
                                        <Input placeholder="Enter email" />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item
                                        name="gender"
                                        label="Gender"
                                        className="genderInput"
                                        rules={[{
                                            required: true,
                                            message: "please select the Gender"
                                        }]}
                                    >
                                        <Radio.Group block optionType="button" buttonStyle="solid" className="genderOptions" >
                                            <Radio value="male" className="maleOption">Male</Radio>
                                            <Radio value="female" className="femaleOption">Female</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={'space-between'} className="addUserRows">
                                <Col span={11}>
                                    <Form.Item
                                        name="role"
                                        label="Role"
                                        // hasFeedback
                                        rules={[{ required: true, message: 'Please select your role!' }]}
                                    >
                                        <Select placeholder="Please select a role" >
                                            <Option value="frontEnd">Front End</Option>
                                            <Option value="backEnd">Back End</Option>
                                            <Option value="hr">HR</Option>
                                            <Option value="bde">BDE</Option>
                                            <Option value="fullStack">Full Stack</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={11} >
                                    <Form.Item
                                        name="file"
                                        label="File"
                                        type='file'
                                        // hasFeedback
                                        rules={[{ required: true, message: 'Please upload Image!' }]}
                                    >
                                        <Row justify={'space-between'}>
                                            <Col span={12}>
                                                <Input type="file" name="file" id="file" onChange={handleFileInputChange} />
                                            </Col>
                                            <Col span={3}>
                                                {fileList || existedData.imageurl ? <Image src={fileList ? fileList : existedData ? existedData.imageurl : ""} width={70}></Image> : ""}
                                            </Col>
                                            <Col span={6} style={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleUpload()}
                                                    disabled={(fileList.length === 0)||uploadPrevent }
                                                    loading={uploading}
                                                    className="btnUpload"
                                                >
                                                    {uploading ? 'Uploading' : 'Start Upload'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="addUserRows">
                                <Col span={24}>
                                    <Form.Item
                                        name="address"
                                        label="Address"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your address!',
                                            },
                                        ]}
                                    >
                                        <Input.TextArea showCount maxLength={1400} className="addUserAddress" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={"space-between"} className="addUserRows">

                                {Object.keys(selectTagData).map((data) =>
                                    <Col span={7}>
                                        <Form.Item
                                            name={data}
                                            label={data.charAt(0).toUpperCase() + data.slice(1)}
                                            // hasFeedback
                                            rules={[{ required: true, message: `Please select your ${data}!` }]}
                                        >
                                            <Select placeholder={`Please select a ${data}`} >
                                                {selectTagData[data].map((detail) =>
                                                    <Option value={detail.charAt(0).toLowerCase() + detail.slice(1)}>{detail}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}



                            </Row>
                            <Row justify={'end'} className="addUserRows">
                                <Col span={7}>
                                    <Form.Item >
                                        <Button type="primary" htmlType='submit' block className='btnUser'>{urlParam ? <>Update</> : <>Submit</>}</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col span={1}></Col>
                </Row >
            </Col >
        </>
    )
}

export default Adduser;