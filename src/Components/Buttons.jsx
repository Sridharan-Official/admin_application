import { Button } from "antd"


const Buttons = (
    type = "",
    htmlType = "submit",
    content = "",
) => {

    return (
        <Button type={type} block htmlType={htmlType} >{content}</Button>
    )

}

export default Buttons;