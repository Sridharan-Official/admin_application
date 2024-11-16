import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Space, Button, notification, Table, Radio, Tag, Modal, Badge, } from 'antd';
import { LuLayout, LuLinkedin, LuUsers, LuLayoutGrid } from "react-icons/lu";
import { FiUser, FiDollarSign, FiTable } from "react-icons/fi";
import { TbLayoutList } from "react-icons/tb";
import { GoStack } from "react-icons/go";
import { BiEdit, BiSolidUserCheck } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdMale, IoMdFemale } from "react-icons/io";

const Dashboard = () => {

  const token = useSelector(detail => atob(atob(detail.authentication.token)))

  const [data, setData] = useState([]);
  const [countDetails, setCountDetails] = useState({
    total: 0,
    male: 0,
    female: 0,
    frontEnd: 0,
    backEnd: 0,
    hr: 0,
    bde: 0,
    fullStack: 0
  });
  
  const [gridView, setGridView] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isemail, setIsEmail] = useState("")

  const navigate = useNavigate();

  const cardIcon = {
    total: <LuUsers size={"6.6vh"} />,
    male: <FiUser size={"6.6vh"} />,
    female: <FiUser size={"6.6vh"} />,
    frontEnd: <LuLayout size={"6.6vh"} />,
    backEnd: <TbLayoutList size={"6.6vh"} />,
    hr: <LuLinkedin size={"6.6vh"} />,
    bde: <FiDollarSign size={"6.6vh"} />,
    fullStack: <GoStack size={"6.6vh"} />

  }

  const getUser = () => (async () => {
    try{

      const users = await axios.get('https://admin-app-bdsu.onrender.com/api/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
  
      const value = users.data.data;
  
      
      if (users.data.success) {
  
        setData([...value]);
  
        const details = value.reduce((accumulator, currentValue) => {
          accumulator[currentValue.gender] = (accumulator[currentValue.gender] || 0) + 1;
          accumulator[currentValue.role] = (accumulator[currentValue.role] || 0) + 1;
          return accumulator;
  
        }, {})
  
        details.total = (details.male || 0) + (details.female || 0);
  
        setCountDetails({ ...countDetails, ...details });
      }
      else {
        setData([]);
      }

    }
    catch(error){
      console.log("Dahboard Error -> ", error);
      
    }
    

  })();

  const deleteUser = async (id) => {
    const rawResponse = await axios.delete(`https://admin-app-bdsu.onrender.com/api/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (rawResponse.data.success) {
      notification.success({
        message: 'Delete Succesful',
        description: `${rawResponse.data.message}`,
      });
    }
    else {
      notification.error({
        message: 'Delete failed',
        description: `${rawResponse.data.message}`,
      });
    }
    getUser();
  }

  const editUser = (id) => {
    setTimeout(() => navigate(`/edit/${id}`), 1000)
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: "action"
    }
  ];

  const tableData = data.map(val => ({
    key: val.id,
    name: <span className='tableUserName' title={`${val.first_name} ${val.last_name}`}>{`${val.first_name} ${val.last_name}`}</span>,
    email: <u className='tableUserEmail' title={val.email}>{val.email}</u>,
    address: <span className='tableUserAddress' title={val.address}>{val.address}</span>,
    gender: <Tag color={val.gender === "male" ? "#362CB4" : "#eb2f96"} >
      {val.gender.toUpperCase()}
    </Tag>,
    role: val.role.includes("End") || val.role.includes("Stack") ? val.role.charAt(0).toUpperCase() + val.role.slice(1) : val.role.toUpperCase(),
    action: (
      <Space size="middle" style={{ verticalAlign: 'middle' }}>
        <Button className='CardEditOptionTable' onClick={() => editUser(val.id)}><BiEdit /></Button>
        <Button className='CardDeleteOptionTable' onClick={() => deleteUser(val.id)}><RiDeleteBinLine /></Button>
      </Space >
    )
  }))

  const showModal = (val) => {
    setIsEmail(val);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      await getUser();
    })();
    // eslint-disable-next-line
  }, [setData]);

  return (

    <>
      <Space wrap size={[25, 25]} className='CountCards' key={"StandardCards"}>

        {Object.keys(countDetails).map((detail) => {

          return (
            <Card key={`cards${detail}`} className="Cards" style={{ width: "37.25vh", height: "13.1vh", display: 'flex', justifyContent: 'center' }} >
              <Row justify={'space-between'}>
                <Col>
                  <Row>{cardIcon[detail]}</Row>
                  <Row className='topic'>{detail.includes("End") || detail.includes("Stack") ? detail.charAt(0).toUpperCase() + detail.slice(1) : detail.toUpperCase()}</Row>
                </Col>
                <Col className='counts'>{countDetails[detail]}</Col>
              </Row>
            </Card>
          )
        })}

      </Space>

      <>
        <Row key={"userCardsViewing"} justify={'space-between'} className='userCardsTitle'>
          <Col className='userCardsTitleHeading'><>USERS</></Col>
          <Col className='userCardsTitleOption'>
            <Radio.Group defaultValue={"grid"} className='viewOptions'>
              <Radio.Button value="grid" className="grids" onClick={() => setGridView(true)}><LuLayoutGrid size={19} style={{ verticalAlign: 'middle' }} /></Radio.Button>
              <Radio.Button value="table" className='tables' onClick={() => setGridView(false)}><FiTable size={19} style={{ verticalAlign: 'middle' }} /></Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        {gridView ?
          (data.length?
            <Space wrap size={[31, 31]} key={"userCards"} className='userDisplay'>
              {data.map(detail =>
                <>
                  <Card key={detail.id} style={{ width: 180, height: 220, backgroundColor: "black", verticalAlign: 'center' }} hoverable >
                    <Col>
                      <Col span={24} className='UserCards' style={{ height: 175, verticalAlign: 'center', marginTop: 10}} onClick={() => showModal(detail.email)}>
                        <Row justify={'center'} className='imageRow'>
                          <img src={detail.imageurl} alt={detail.first_name} width={70} height={70} className='cardImage' />
                        </Row>
                        <Row className='userName' justify={'center'} title={`${detail.first_name} ${detail.last_name}`}>{`${detail.first_name} ${detail.last_name}`}</Row>
                        <Row className='userEmail' justify={'center'} title={detail.email}><u>{`${detail.email}`}</u></Row>
                      </Col>
                      <Row justify={'space-evenly'}>
                        <Button className='CardEditOption' onClick={() => editUser(detail.id)}><BiEdit /></Button>
                        <Button className='CardDeleteOption' onClick={() => deleteUser(detail.id)}><RiDeleteBinLine /></Button>
                      </Row>
                    </Col>
                  </Card>
  
                  <Modal
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    centered
                    title={
                      <>
                        <span className='modalUserName' title={`${detail.first_name} ${detail.last_name}`}>{detail.first_name} {detail.last_name}</span>
                        <Tag color='#362CB4' className='roleTag' >
                          <BiSolidUserCheck size={19} className='roleTagIcons' />
                          {detail.role.includes("End") || detail.role.includes("Stack") ? 
                          detail.role.charAt(0).toUpperCase() + detail.role.slice(1) : detail.role.toUpperCase()}
                        </Tag>
                      </>}
                    open={isModalOpen && isemail === detail.email}
                    onCancel={handleCancel}
                    className='modalCards'
                    key={`userModal${detail.id}`}
                  >
                    <Row className='modelInteriorMargin'>
                      <Col span={2}></Col>
                      <Col span={20}>
                        <Badge.Ribbon text={detail.gender === "male" ? <IoMdMale /> : <IoMdFemale />} color={detail.gender === "male" ? "#362CB4" : "#eb2f96"}>
                          <Col span={24} className='modalInterior'>
                            <Row>
                              <img src={detail.imageurl} width={115} height={115} className='modalImage' alt={detail.first_name} />
                            </Row>
                            <Row className='modalKey intialModalKey'>Email: <Col className='modalData' title={detail.email}>{detail.email}</Col></Row>
                            <Row className='modalKey'>Address: <Col className='modalData' title={detail.address}>{detail.address}</Col></Row>
                            <Row className='modalKey'>Created at: <Col className='modalData'>{detail.created_at}</Col></Row>
                            <Row>
                              <Col span={2}></Col>
                              <Col span={20}>
                                <Row justify={'space-between'}>
                                  <Button className='modalCardEditOption' onClick={() => editUser(detail.id)}><BiEdit />Edit</Button>
                                  <Button className='modalCardDeleteOption' onClick={() => deleteUser(detail.id)}><RiDeleteBinLine />Delete</Button>
                                </Row>
                              </Col>
                              <Col span={2}></Col>
                            </Row>
                          </Col>
                        </Badge.Ribbon>
                      </Col>
                      <Col span={2}></Col>
                    </Row>
                  </Modal>
                </>
              )}
  
            </Space>
            :
            <Row justify={'center'} className='userData' style={{fontSize:30}}>No user found</Row>
            )
          :
          <Table pagination={false} columns={tableColumns} dataSource={tableData} className='userCardsTable' />
        }
      </>
    </>
  )
}

export default Dashboard;