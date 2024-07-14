import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { checkAccess, mapToEmployees, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { PositionEnum } from '../../Classes/PositionEnum';

interface Employee {
    fullname: string;
    position: number;
    subDivision: number;
    peoplePartnerId: string;
    outOfOfficeBalance: number;
    photo?: File;
}

const schema = yup.object().shape({
    fullname: yup.string().required('Fullname is required'),
    position: yup.number().required('Position is required'),
    subDivision: yup.number().required('Sub Division is required'),
    peoplePartnerId: yup.string().required('People Partner is required'),
    outOfOfficeBalance: yup.number().required('Out Of Office Balance is required').min(0, 'Balance must be a positive number'),
    photo: yup.mixed().notRequired()
});

const EditEmployee: React.FC = () => {
    const {employee,setEmployee} = useEmployee();
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [edittedEmployee, setEdittedEmployee] = useState<Employee>({
        fullname: '',
        position: 0,
        subDivision: 0,
        peoplePartnerId: '',
        outOfOfficeBalance: 0,
        photo: undefined
    });
    const [peoplePartners, setPeoplePartners] = useState<any[]>([]);
    const [photo, setPhoto] = useState<string>(''); 
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: edittedEmployee
    });

    const { fullname, position, subDivision, peoplePartnerId, outOfOfficeBalance } = watch();
    
    useEffect(() => {
        if(!checkAccess(employee,[PositionEnum.HR_Manager]))
        {
            navigate("/Employees");
        }
        const fetchEmployeeData = () => {
            api.get(`/Employee/${employeeId}`)
                .then((response) => {
                    // const fetchedEmployee: Employee = response.data;
                    console.log(response.data);
                    
                    setEdittedEmployee(response.data);
                    setPhoto(response.data.photoPath)
                    setValue('photo',response.data.photoPath);
                    setValue('fullname', response.data.fullName);
                    setValue('position', response.data.position);
                    setValue('subDivision', response.data.subDivision);
                    setValue('peoplePartnerId', response.data.peoplePartner ? response.data.peoplePartner.id: undefined);
                    setValue('outOfOfficeBalance', response.data.outOfOfficeBalance);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching employee data:', error);
                    navigate('/employees');
                });
        };

        const fetchPeoplePartnersData = () => {
            api.get('/Employee/getHrManagers')
                .then((response) => {
                    const mappedPeoplePartners = mapToEmployees(response.data);
                    setPeoplePartners(mappedPeoplePartners);
                })
                .catch((error) => {
                    console.error('Error fetching people partners data:', error);
                });
        };

        fetchPeoplePartnersData();
        fetchEmployeeData();
    }, [employeeId, setValue]);

    const onSubmit = (data: Employee) => {
        if(typeof data.photo === 'string')
            data.photo = undefined
        console.log(data);
        
        api.put(`Employee/${employeeId}`, data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                navigate('/employees');
            })
            .catch((error) => {
                console.error('Error updating employee:', error);
            });
    };
    const onPhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPhoto(URL.createObjectURL(file!));
        setValue('photo', file); 
    };

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Grid container spacing={2} marginTop="1%">
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        {/* //@ts-ignore */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">Edit Employee</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('fullname')}
                                        error={!!errors.fullname}
                                        helperText={errors.fullname ? errors.fullname.message : ''}
                                        label="Fullname*"
                                        fullWidth
                                        value={fullname}
                                        onChange={(e) => setValue('fullname', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Position*</InputLabel>
                                        <Select
                                            {...register('position')}
                                            error={!!errors.position}
                                            fullWidth
                                            value={position}
                                            onChange={(e) => setValue('position', +e.target.value)}
                                        >
                                            <MenuItem value={0}>Employee</MenuItem>
                                            <MenuItem value={1}>HR Manager</MenuItem>
                                            <MenuItem value={2}>Project Manager</MenuItem>
                                            <MenuItem value={3}>Administrator</MenuItem>
                                        </Select>
                                        {errors.position && <Typography color="error">{errors.position.message}</Typography>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Sub Division*</InputLabel>
                                        <Select
                                            {...register('subDivision')}
                                            error={!!errors.subDivision}
                                            fullWidth
                                            value={subDivision}
                                            onChange={(e) => setValue('subDivision', +e.target.value)}
                                        >
                                            <MenuItem value={0}>HR</MenuItem>
                                            <MenuItem value={1}>IT</MenuItem>
                                            <MenuItem value={2}>Projects</MenuItem>
                                        </Select>
                                        {errors.subDivision && <Typography color="error">{errors.subDivision.message}</Typography>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>People Partner*</InputLabel>
                                        <Select
                                            {...register('peoplePartnerId')}
                                            error={!!errors.peoplePartnerId}
                                            fullWidth
                                            value={peoplePartnerId}
                                            onChange={(e) => setValue('peoplePartnerId', e.target.value)}
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
                                        value={outOfOfficeBalance}
                                        onChange={(e) => setValue('outOfOfficeBalance', parseInt(e.target.value))}
                                    />
                                </Grid>
                                
                                    {photo && (
                                            <Grid item xs={12}>
                                                <img src={photo} width='44%' style={{marginRight: "1%"}} />
                                                <img src={photo} width='34%' style={{marginRight: "1%"}} />
                                                <img src={photo} width='20%' />
                                            </Grid>
                                    )}
                                <Grid item xs={12}>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                    >
                                        Upload Photo
                                        <input
                                            {...register('photo')}
                                            onChange={onPhotoInput}
                                            accept="image/png, image/gif, image/jpeg"
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    
                                    <Grid container spacing={1}>
                                <Grid item xs={12}>
                                <Button variant="contained" color="success" type="submit" fullWidth>
                                        Save Changes
                                    </Button>  
                                </Grid>
                                <Grid item xs={12}>
                                <Button variant="text" component={Link} to="/employees" fullWidth>Back to list</Button>
                                </Grid>
                                </Grid>
                                </Grid>
                                
                                
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            )}
        </>
    );
};

export default EditEmployee;
