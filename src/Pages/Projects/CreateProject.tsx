import { Button,FormHelperText, FormControl, Grid, InputLabel, Select, TextField, Typography, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Link,useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from 'react'
import api from '../../Components/AxiosConfig/AxiosConfig';
import { Employee, checkAccess, mapToEmployees, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import { PositionEnum } from '../../Classes/PositionEnum';
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function CreateProject(){
    const schema = yup.object().shape({
        projectManagerId: yup.string().required("Project manager is required"),
        projectType: yup.string().required("Project type is required"),
        comment: yup.string().notRequired(),
        startDate: yup.string().required("Start date is required"),
        memberIds: yup.mixed().notRequired()
    })

    const {employee} = useEmployee();
    const navigate = useNavigate();
    const [projectManagers,setProjectManagers] = React.useState<Employee[]>()
    useEffect(()=>{
        
        if(!checkAccess(employee,[PositionEnum.Project_Manager]))
        {
            navigate("/projects");
        }
        const getProjectManagers = ()=>{
            api.get("Employee/getProjectManagers").then((resp)=>
            {
                setProjectManagers(mapToEmployees(resp.data));
            }
            );
        }
        const getMembers = ()=>{
            api.get("Employee/getMembers").then((resp)=>
            {
                setMembers(mapToEmployees(resp.data));
            }
            );
        }
        getMembers();
        getProjectManagers();
    },[])
    
    const [projectType, setProjectType] = React.useState('');
    const [projectManager, setProjectManager] = React.useState('');
    const [members, setMembers] = React.useState<Employee[]>();
    const [memberIds, setMemberIds] = React.useState<string[]>([]);
    const onSubmit = (data: any)=>{
        data.startDate = startDate?.format('YYYY-MM-DD');
        data.projectType = +data.projectType;

        console.log(data);

        api.post("Projects",data).then(resp=>{
            console.log(resp.data);
            navigate("/projects");
        })
    }
    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm({
        resolver: yupResolver(schema)
    })
    const [startDate,setStartDate] = React.useState<Dayjs|null>(dayjs())
    const handleMemberChange = (e:any)=>{
        setMemberIds(
            typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
          );
    }
    return (
        <>
            <Grid container spacing={2} marginTop={"3%"}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
            <form 
            onSubmit={handleSubmit(onSubmit)}
            >
          <Grid container spacing={4}>
              <Grid item xs={12}>
              <Typography variant='h5' textAlign="center" >
                    Create project
              </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Project type*</InputLabel>
                    <Select 
                    {...register("projectType")}
                    error={!!errors.projectType}
                    value={projectType} 
                    label="Project type*" 
                    onChange={(e)=>setProjectType(e.target.value as string)}
                    >
                        <MenuItem value={0}>Bussiness</MenuItem>
                        <MenuItem value={1}>OutSource</MenuItem>
                    </Select>
                    <FormHelperText sx={{color: "crimson"}}>{errors.projectType ? errors.projectType.message : ''}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Project manager*</InputLabel>
                    <Select 
                    {...register("projectManagerId")}
                    error={!!errors.projectManagerId}
                    value={projectManager}  label="Project manager*"  onChange={(e)=>setProjectManager(e.target.value as string)}
                    
                    >
                        {projectManagers?.map((manager) => (
                        <MenuItem key={manager.id} value={manager.id}>
                            {manager.fullname}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText sx={{color: "crimson"}}>{errors.projectManagerId ? errors.projectManagerId.message : ''}</FormHelperText>
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
                  {...register("comment")}
                  fullWidth
                  multiline
                /> 
                
              </Grid>
              
              <Grid item xs ={12}>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer 
                     components={['DatePicker']} >
                        <DatePicker
                        {...register("startDate")}
                        label="Start date*"
                        value={startDate}
                        onChange={(value)=> setStartDate(value)}
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
                            
                    </DemoContainer>
                    
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      <Button variant='contained' color="success" fullWidth type="submit">
                        Create
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
        </>
    );
}
export default CreateProject