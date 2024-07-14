import React, { useEffect, useState } from 'react';
import { Button, FormHelperText, FormControl, Grid,MenuItem, InputLabel, Select, TextField, Typography, CircularProgress } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { Employee, checkAccess, mapToEmployees, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import { PositionEnum } from '../../Classes/PositionEnum';

function EditProject() {
    const schema = yup.object().shape({
        projectManagerId: yup.string().required("Project manager is required"),
        projectType: yup.string().required("Project type is required"),
        comment: yup.string().notRequired(),
        startDate: yup.string().required("Start date is required"),
        memberIds: yup.mixed().notRequired()
    });

    const { employee } = useEmployee();
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [projectManagers, setProjectManagers] = useState<Employee[]>([]);
    const [projectType, setProjectType] = useState<string>('');
    const [projectManager, setProjectManager] = useState<string>('');
    const [memberIds, setMembersIds] = useState<string[]>();
    const [members, setMembers] = React.useState<Employee[]>();
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [comment, setComment] = useState<string>();
    const [loading, setLoading] = React.useState(true);
    useEffect(() => {
        if (!checkAccess(employee, [PositionEnum.Project_Manager])) {
            navigate("/projects");
        }

        const getProjectManagers = async () => {
            api.get("Employee/getProjectManagers").then((resp)=>{
                setProjectManagers(mapToEmployees(resp.data));
            }).catch((error)=>{
                console.error('Failed to fetch project managers', error);
                
            });
        };

        const getProject = async () => {
            api.get(`Projects/${projectId}`).then((resp)=>{
                setStartDate(dayjs(resp.data.startDate));
                setProjectManager(resp.data.projectManager.id);
                setProjectType(resp.data.projectType.toString());
                setComment(resp.data.comment);
                setMembersIds(resp.data.members.map((item: any)=>item.id));
                setValue("memberIds", resp.data.members.map((item: any)=>item.id));
                setValue("comment",resp.data.comment);
                setValue("projectManagerId",resp.data.projectManager.id);
                setValue("projectType",resp.data.projectType);
                setValue("startDate",resp.data.startDate);
                setLoading(false);
                console.log(resp.data.members.map((item: any)=>item.id));
                
            }).catch((error) =>{
                console.error('Failed to fetch project', error);
                navigate('/projects');
            });
        };
        const getMembers = ()=>{
            api.get("Employee/getMembers").then((resp)=>
            {
                setMembers(mapToEmployees(resp.data));
            }
            );
        }
        
        getProjectManagers();
        getMembers();
        getProject();
    }, [employee, navigate, projectId]);

    const onSubmit = (data: any) => {
        data.startDate = startDate?.format('YYYY-MM-DD');
        data.projectType = +data.projectType;
        console.log(data);
        
        api.put(`Projects/${projectId}`, data).then(() => {
            navigate("/projects");
        });
    };

    const { register, handleSubmit,setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const handleMemberChange = (e:any)=>{
        setMembersIds(
            typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
          );
    }
    return (
        <>
        {
            loading ? 
            <div style={{left:"48%", top:"48%",position:"absolute"}}>
                <CircularProgress  />
            </div>
            
            
            :
            <Grid container spacing={2} marginTop={"3%"}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant='h5' textAlign="center">
                                Edit Project
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Project type</InputLabel>
                                <Select
                                    {...register("projectType")}
                                    error={!!errors.projectType}
                                    value={projectType}
                                    label="Project type"
                                    onChange={(e) => setProjectType(e.target.value as string)}
                                >
                                    <MenuItem value={0}>Business</MenuItem>
                                    <MenuItem value={1}>Outsource</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: "crimson" }}>{errors.projectType ? errors.projectType.message : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Project manager</InputLabel>
                                <Select
                                    {...register("projectManagerId")}
                                    error={!!errors.projectManagerId}
                                    value={projectManager}
                                    label="Project manager"
                                    onChange={(e) => setProjectManager(e.target.value as string)}
                                >
                                    {projectManagers.map((manager) => (
                                        <MenuItem key={manager.id} value={manager.id}>
                                            {manager.fullname}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText sx={{ color: "crimson" }}>{errors.projectManagerId ? errors.projectManagerId.message : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Members</InputLabel>
                    <Select
                    {...register("memberIds")}
                    error={!!errors.memberIds}
                    value={memberIds}
                    label="Members"
                    onChange={handleMemberChange}
                    multiple
                    >
                        {members?.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                            {member.fullname}
                        </MenuItem>
                        ))}
                    
                    </Select>
                </FormControl>
              </Grid>
                        <Grid item xs={12}>
                        <TextField
                                            label="Comment"
                                            {...register('comment')}
                                            fullWidth
                                            value={comment}
                                            multiline
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                            {/* <TextArea {...register("comment")} placeholder="Write comment" width="100%" value={comment} onChange={(e)=>setComment(e.target.value)}></TextArea> */}
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    {...register("startDate")}
                                    label="Start date"
                                    value={startDate}
                                    onChange={(value) => setStartDate(value)}
                                    minDate={dayjs()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: "normal",
                                            error: !!errors.startDate,
                                            helperText: errors.startDate ? errors.startDate.message : '',
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Button variant='contained' color="success" fullWidth type="submit">
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="text" component={Link} to="/projects" fullWidth>Back to list</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
        }
        </>
    );
}

export default EditProject;
