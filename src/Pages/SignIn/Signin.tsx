// src/components/SignIn.js
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React from 'react';
//@ts-ignore
import Cookies from 'js-cookie';
import SignInModel from '../../Classes/SignInModel';
import { useNavigate  } from 'react-router-dom';
import { useEmployee, mapToEmployee } from '../../Components/EmployeeContext/EmployeeContext';
   
    
function SignIn() {
    const schema = yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
      });
      const { employee, setEmployee } = useEmployee();
      const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors }
    } = useForm({
      resolver: yupResolver(schema) // Используем resolver для yup
    });
    React.useEffect(()=>{
      if(employee)
        navigate('/');
    },[])
    const onSubmit = (data?: SignInModel) => {
        axios.post('https://localhost:7100/api/Authentication/Login', data, {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(resp=>{
            Cookies.set('accessToken', resp.data.accessToken, { expires: 1, path: '/' }); 
            console.log("access token ",resp.data.accessToken);
            const employee = mapToEmployee(resp.data);
            setEmployee(employee);

            navigate("/leave-requests");


        }).catch(error=>{
            const erText = error.response.data.error;
            if(erText =="Wrong email or password")
            {
                setError("username", {
                    type: "manual",
                    message: "Wrong username or password",
                  });
                setError("password", {
                    type: "manual",
                    message: "Wrong username or password",
                  });
            }
        });
    }
  
    return (
      <Grid container spacing={2} marginTop={"3%"}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='h4' textAlign={"center"}>Sign in</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message?.toString() : ""} 
                  label="Username"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('password')}
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message?.toString() : ''}
                  label="Password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' color="success" fullWidth type="submit">
                  Sign in
                </Button>
              </Grid>
          </Grid>
            </form>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    );
  }
  

export default SignIn;
