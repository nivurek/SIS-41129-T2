import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Grid, Menu,
  MenuItem
} from 'semantic-ui-react';

import LoginGridComponent from './components/LoginComponent';
import SignupGridComponent from './components/SignupGridComponent';


const LoginPage = ({userData, handleLogin}) => {

  console.log('LoginPage:', userData, handleLogin);

  const [loginMode, setLoginMode] = useState(true);

  const handleToggle = (option) => {
    console.log(`Toggled to: ${option}`)
    // You can perform any action here based on the selected option
  }

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <div className='landingPages'>
      <div className='rightSideBox' >
        {/* ============================  Top Section ============================ */}
        <div style={{flex: "3", width: "100%"}}>
          <Button
            style={{margin: '20px'}}
            icon='left arrow'
            labelPosition='left'
            content={'Go Back'}
            onClick={handleGoBack}
          >

          </Button>
        </div>
        {/* ============================ Grid Section ============================ */}
        <div style={{flex: "8", width: "100%"}}>
          <Grid style={{  }}>
            <Grid.Column style={{ margin: "40px" }}>

              <Grid.Row>
                <Grid.Column className='thisisparent'>
                  {/* <SwitchComponent onToggle={handleToggle} /> */}
                  <Menu
                    secondary
                    style= {{ backgroundColor: "rgb(241, 241, 241)", borderRadius: "10px" }}
                  >
                    <MenuItem
                      style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <Button fluid basic style={{ boxShadow: "none" }} active={!loginMode} onClick={() => setLoginMode(false)}>
                        Sign Up
                      </Button>
                    </MenuItem>
                    <MenuItem
                      style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <Button fluid basic style={{ boxShadow: "none" }} active={loginMode} onClick={() => setLoginMode(true)}>
                        Log In
                      </Button>
                    </MenuItem>
                  </Menu>
                  
                </Grid.Column>
              </Grid.Row>
              
              <Grid.Row>
                {loginMode ? (
                  <LoginGridComponent userData={userData} handleLogin={handleLogin} />
                ) : (
                  <SignupGridComponent/>
                )}
              </Grid.Row>

            </Grid.Column>
          </Grid>
        </div>
        {/* ======================================================== */}
      </div>
    </div>
  );
};


export default LoginPage;