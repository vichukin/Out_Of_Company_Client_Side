// src/components/SignIn.js
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
//@ts-ignore
import Cookies from 'js-cookie';
import SignInModel from '../../Classes/SignInModel';
import { useNavigate  } from 'react-router-dom';
import { useEmployee, mapToEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import api from '../../Components/AxiosConfig/AxiosConfig';
   
    
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
      resolver: yupResolver(schema) 
    });
    React.useEffect(()=>{
      if(employee)
        navigate('/');
    },[])
    const onSubmit = (data?: SignInModel) => {
        api.post('/Authentication/Login', data, {
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
        <Grid item xs={4}>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              <Typography variant="h6">You can use this sign-in information for testing:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'><strong>Position:</strong> Administrator</Typography>
                <Typography variant='body1'><strong>Username:</strong> test</Typography>
                <Typography variant='body1'><strong>Password:</strong> zaq1@WSX</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'><strong>Position:</strong> HR manager</Typography>
                <Typography variant='body1'><strong>Username:</strong> hrmtest</Typography>
                <Typography variant='body1'><strong>Password:</strong> zaq1@WSX</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'><strong>Position:</strong> Project manager</Typography>
                <Typography variant='body1'><strong>Username:</strong> prmtest</Typography>
                <Typography variant='body1'><strong>Password:</strong> zaq1@WSX</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'><strong>Position:</strong> Employee</Typography>
                <Typography variant='body1'><strong>Username:</strong> emptest</Typography>
                <Typography variant='body1'><strong>Password:</strong> zaq1@WSX</Typography>
            </Grid>
          </Grid>
        </Grid>
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
