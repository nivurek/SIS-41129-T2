import React, { useState } from 'react';
import {
  Button,
  Grid,
  Menu,
  MenuItem,
} from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

import LoginGridComponent from './components/LoginComponent';
import SignupGridComponent from './components/SignupGridComponent';


const LoginPage = ({handleLogin}) => {

  console.log('LoginPage:', handleLogin);

  const [loginMode, setLoginMode] = useState(true);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <div className='login-page'>
      <div className='right-side-box' >
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
          <Grid className='aligned-grid'>
            <Grid.Column style={{ margin: "40px" }}>

              <Grid.Row>
                <Grid.Column className='thisisparent'>
                  <Menu
                    secondary
                    style= {{ backgroundColor: "rgb(241, 241, 241)", borderRadius: "10px" }}
                  >
                    <MenuItem
                      style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: '0px' }}
                    >
                      <Button fluid basic style={{ boxShadow: "none" }} active={!loginMode} onClick={() => setLoginMode(false)}>
                        Sign Up
                      </Button>
                    </MenuItem>
                    <MenuItem
                      style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: '0px' }}
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
                  <LoginGridComponent handleLogin={handleLogin} />
                ) : (
                  <SignupGridComponent handleLogin={handleLogin} />
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