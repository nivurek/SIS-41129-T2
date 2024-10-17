import React, { useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginGridComponent = () => {
  const navigate = useNavigate();

  // State to hold form values
  const [formData, setFormData] = useState({
    email: '',
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Make API call to login route
      const response = await axios.post('http://localhost:5050/auth/login', { email, password });

      // Handle successful login
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token); // Store the token in local storage
        navigate('/'); // Navigate to home page
      }
    } catch (error) {
      // Handle error during login
      setErrorMessage(error.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Icon name='user' /> Log-in to your account
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder='E-mail address'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button color='teal' fluid size='large'>
              Login
            </Button>
          </Segment>
        </Form>
        {errorMessage && (
          <Message error>
            <Icon name='warning sign' />
            {errorMessage}
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default LoginGridComponent;