import { DELETE, SAVE } from "../Action_Type/ActionType"
import { notification } from "antd";


export const save = (data) => {
    return { type: SAVE, payload: data }
}

export const remove = (path) => {
    return { type: DELETE }
}

export const fetchAPI = (values, navigate) => async (dispatch) => {


    try {
        const rawResponse = await fetch('https://admin-app-bdsu.onrender.com/api/v1/admin/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: values.email, password: values.password })
        });

        // content is used to store the response from the API.
        const content = await rawResponse.json();

        if (content.success) {


            notification.success({
                message: 'Login Successful',
                description: `Hello, ${content.data.first_name}`,
            })
            content.data.loginTime = Date.now();
            dispatch(save(content.data));
            console.log(content.data)

            setTimeout(() => navigate("/dashboard"), 1000)
        }
        else {
            notification.error({
                message: 'Login Failed',
                description: `${content.error}`,
            })
        }
    }
    catch (error) {
        console.log(error);
    }
}

export const RegisterUser = (values, navigate) => async (dispatch) => {
    try {
        const rawResponse = await fetch('https://admin-app-bdsu.onrender.com/api/v1/admin/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name: values.fisrt_name, last_name: values.last_name, email: values.email, password: values.password })
        });

        // In content we store the response of the API 
        const content = await rawResponse.json();

        // If registration was successful it shows the success notification and navigate to the login page
        if (content.success) {
            notification.success({
                message: 'Registration Successful',
                description: `${content.message}`,
            });
            // we are delaying the 1 sec to navigate
            setTimeout(() => navigate("/"), 1000)
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

    }
    catch (error) {
        console.log(error);
    }
}