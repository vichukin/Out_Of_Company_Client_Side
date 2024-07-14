import { Button, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//@ts-ignore
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { checkAccess, mapToEmployees, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { PositionEnum } from '../../Classes/PositionEnum';

interface RegisterForm {
    fullname?: string;
    position?: string | number;
    subDivision?: string | number ;
    peoplePartnerId?: string;
    outOfOfficeBalance?: number;
    Password: string;
    confirmPassword: string;
    photo?: FileList | File;
}

const schema = yup.object().shape({
    fullname: yup.string().required('Fullname is required'),
    position: yup.string().required('Position is required'),
    subDivision: yup.string().required('Sub Division is required'),
    peoplePartnerId: yup.string().required('People Partner is required'),
    outOfOfficeBalance: yup.string().required('Out Of Office Balance is required'),
    Password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').matches(/[A-Z]/, 'Password must contain at least one uppercase letter').matches(/[a-z]/, 'Password must contain at least one lowercase letter').matches(/[0-9]/, 'Password must contain at least one number').matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    confirmPassword: yup.string().oneOf([yup.ref('Password')], 'Passwords must match').required('Confirm password is required'),
    photo: yup.mixed<FileList>().notRequired()
});
interface EmployeeLoginInfo{
    username: string;
    password: string;
}
function RegisterEmployee() {
    const [employeeLoginInfo,setEmployeeLoginInfo] = React.useState<EmployeeLoginInfo>();
    const navigate = useNavigate();
    const [peoplePartners, setPeoplePartners] = useState<any[]>([]);
    const [open, setOpen] = React.useState(false);
    const {employee} = useEmployee();
    useEffect(() => {
        if(!checkAccess(employee,[PositionEnum.HR_Manager]))
        {
            navigate("/employees");
        }
        // Fetch people partners from API
        axios.get('https://localhost:7100/api/Employee/getHrManagers').then(resp => {
            console.log(mapToEmployees(resp.data));
            
            setPeoplePartners(mapToEmployees(resp.data));
        }).catch(error => {
            console.error('Failed to fetch people partners', error);
        });
    }, []);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema) // Используем resolver для yup
    });

    const onSubmit = async (data: RegisterForm) => {
       var balance = +data.outOfOfficeBalance!;
       if(balance<0)
        {
            setError("outOfOfficeBalance",{message: "Balance must be a positive number"} );
            return;
        }
        data.outOfOfficeBalance = +data.outOfOfficeBalance!;
        data.position = +data.position!;
        data.subDivision = + data.subDivision!;
        data.photo = (data.photo as FileList)[0] ;
        api.post("Authentication/register",data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((resp)=>{
            console.log(resp.data);
            setEmployeeLoginInfo({username: resp.data.username, password: resp.data.password});
            setOpen(true);

            
        }).catch((error)=>{
            console.log(error);
            
        })

    };
    const [photo,setPhoto] = React.useState('');
    const onPhotoInput = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e);
        const file = e.target.files?.[0]
        setPhoto(URL.createObjectURL(file!));
    }
    
      const handleClose = () => {
        setOpen(false);
        navigate('/employees')
      };
    
    return (
        <>
        {employeeLoginInfo&&<Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                Employee login info
            </DialogTitle>
            <DialogContent>
            <Typography><strong>Username:</strong> {employeeLoginInfo?.username}</Typography>
            <Typography><strong>Password:</strong> {employeeLoginInfo?.password}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>}
        <Grid container spacing={2} marginTop={"1%"}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <form onSubmit={handleSubmit(onSubmit as any)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4' textAlign={"center"}>Register</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('fullname')}
                                error={!!errors.fullname}
                                helperText={errors.fullname ? errors.fullname.message : ""}
                                label="Fullname*"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel >Position*</InputLabel>
                                <Select
                                    {...register('position')}
                                    error={!!errors.position}
                                    fullWidth
                                >
                                    <MenuItem  value={0}>Employee</MenuItem>
                                    <MenuItem  value={1}>HR Manager</MenuItem>
                                    <MenuItem  value={2}>Project Manager</MenuItem>
                                    <MenuItem  value={3}>Administrator</MenuItem>
                                </Select>
                                {errors.position && <Typography color="error">{errors.position.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="subDivision-label">Sub Division*</InputLabel>
                                <Select
                                    {...register('subDivision')}
                                    labelId="subDivision-label"
                                    label="Sub Division*"
                                    error={!!errors.subDivision}
                                    fullWidth
                                >
                                    <MenuItem  value={0}>HR</MenuItem>
                                    <MenuItem  value={1}>IT</MenuItem>
                                    <MenuItem  value={2}>Projects</MenuItem>
                                </Select>
                                {errors.subDivision && <Typography color="error">{errors.subDivision.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="peoplePartner-label">People Partner*</InputLabel>
                                <Select
                                    {...register('peoplePartnerId')}
                                    labelId="peoplePartner-label"
                                    label="People Partner*"
                                    error={!!errors.peoplePartnerId}
                                    fullWidth
                                >
                                    {peoplePartners.map((partner) => (
                                        <MenuItem key={partner.id} value={partner.id}>{partner.fullname}</MenuItem>
                                    ))}
                                </Select>
                                {errors.peoplePartnerId && <Typography color="error">{errors.peoplePartnerId.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('outOfOfficeBalance')}
                                type="number"
                                
                                error={!!errors.outOfOfficeBalance}
                                helperText={errors.outOfOfficeBalance ? errors.outOfOfficeBalance.message : ''}
                                label="Out Of Office Balance*"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('Password')}
                                type="password"
                                error={!!errors.Password}
                                helperText={errors.Password ? errors.Password.message : ''}
                                label="Password*"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('confirmPassword')}
                                type="password"
                               
                                error={!!errors.confirmPassword}
                               
                                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                                label="Confirm Password*"
                                fullWidth
                            >0</TextField>
                        </Grid>
                        {
                         photo && <Grid item xs={12}>
                            <img src={photo} width='44%' style={{marginRight: "1%"}} />
                            <img src={photo} width='34%' style={{marginRight: "1%"}} />
                            <img src={photo} width='20%' />
                         </Grid>   
                        }
                        <Grid item xs={12}>
                        <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        >
                        Upload photo
                        <input
                         {...register("photo")}
                         onInput={onPhotoInput}
                         accept="image/png, image/gif, image/jpeg"
                         type="file" hidden />
                        </Button>
                        </Grid>
                        
                        <Grid item xs={12}>
                            
                                <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Button variant='contained' color="success" fullWidth type="submit">
                                         Register
                                    </Button>  
                                </Grid>
                                <Grid item xs={12}>
                                <   Button variant="text" component={Link} to="/employees" fullWidth>Back to list</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
        </>
    );
}

export default RegisterEmployee;
