import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import PrivateLayout from './Pages/PrivateLayout/PrivateLayout';
import PublicRouting from './Routes/Rotings/PublicRouting/PublicRouting';
import { Col, Row, Spin } from 'antd';

function App() {

  const isDataKeys = useSelector(detail => detail.authentication);

  return (
    <>
      {isDataKeys.token ?
        <PrivateLayout /> :
        <Routes>
          {(PublicRouting.map((route, index) => {
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
          }))}
        </Routes>
      }
    </>
  );
}

export default App;
