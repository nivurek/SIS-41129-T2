import React, { useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Icon,
  Message,
} from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';


const LoginGridComponent = ({userData, handleLogin}) => {

  const navigate = useNavigate();

  // State to hold form values
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // State to handle error messages (optional)
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e, { name, value }) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    const { username, password } = formData;
    console.log('Form Data:', formData, "Data:", userData);

    // Mock login logic (replace with your API call)
    const userObject = userData[username];
    console.log("Found user >", userObject);
    if (userObject === undefined) {
      setErrorMessage("Invalid username or password");
    } else {
      if (userObject.password === password) {
        console.log("Success");
        setErrorMessage("");
        navigate('/');
        handleLogin(userObject);
      } else {
        console.log("Fail");
        setErrorMessage("Invalid username or password");
      }
    }
  };

  console.log("Errormsg:", errorMessage);
  

  return (
      <Grid.Column>

        <Grid.Row>
          <Form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <Button fluid size="large" style={{ backgroundColor: "rgb(229,185,75)" }}>
              Login
            </Button>
          </Form>
        </Grid.Row>

        <Grid.Row columns={2} style={{fontWeight: "bold" }}>
          <Grid className='alignedGrid' stackable style={{ paddingTop: "40px" }}>
            <Grid.Row columns={2} style={{ fontWeight: 'bold' }}>
              {/* Outer columns */}
              <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'right' }}>
                <div style={{ textAlign: 'center'}}>
                  Forgot your password?
                </div>
              </Grid.Column>
              <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'left' }}>
                <div style={{ textAlign: 'center', color: 'rgb(229,185,75)' }}>
                  Reset Password
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Row>
        {errorMessage && (
          <Message error icon style={{fontWeight: "bold"}} onClick={() => {setErrorMessage("")}}>
            <Icon name='warning sign' size='mini'/>
            {errorMessage}
          </Message>
        )}
      </Grid.Column>
      
    
  )
}

export default LoginGridComponent;