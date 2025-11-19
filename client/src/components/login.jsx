import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
//import { Link } from 'react-router-dom';
//import Logo from '../assets/logo.png';
//import { UserSchemaValidation } from '../validations/userSchemaValidation';
//import { useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';
//import { useEffect, useState } from 'react';

//import { getUser } from '../features/UserSlice';
//import {useDispatch,useSelector} from 'react-redux';
//import { useNavigate } from 'react-router-dom';
//import { isAxiosError } from 'axios';

const Login = () => {

    //UseStates


    //Validation Configuration


    return (
<div>
    <Container fluid>
        <Row className='div-row'>
            <Col md='6' className='div-col'>
                <form className='div-form'>
                    <div>
                        
                    </div>

                    <FormGroup>
                        <Label>Email</Label>
                        <input
                            placeholder='Please Enter your Email here...'
                            type='email'
                            className='form-control'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Password</Label>
                        <input
                            placeholder='Please Enter your Password here...'
                            type='password'
                            className='form-control'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input type='checkbox' />
                        <Label>Remember Me</Label>
                    </FormGroup>

                    <FormGroup>
                        <Button className='form-control' color='dark'>
                            Sign In
                        </Button>
                    </FormGroup>

                    <FormGroup className='text-center'>
                        <Label>Forget password</Label>
                    </FormGroup>

                    <FormGroup className='text-center'>

                    </FormGroup>
                </form>
            </Col>
        </Row>
    </Container>
</div>

    );
}

export default Login;