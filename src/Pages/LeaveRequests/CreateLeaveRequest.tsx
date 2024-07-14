import React from 'react';
import { Button,FormHelperText, FormControl, Grid, InputLabel, Select, TextField, Typography, SelectChangeEvent, MenuItem } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';
import * as yup from 'yup';
import { Link,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../Components/AxiosConfig/AxiosConfig';

function CreateLeaveRequest() {
    const schema = yup.object().shape({
        absenceReason: yup.string().required("Absence reason is required!"),
        comment: yup.string().notRequired()
    });
    const navigate = useNavigate();
    const onSubmit = (data: any)=>{
        console.log(data);
        data.absenceReason = +data.absenceReason; 
        const startDate = date[0]?.format('YYYY-MM-DD');
        const endDate =  date[1]?.format('YYYY-MM-DD');
        data.startDate = startDate;
        data.endDate = endDate;
        api.post("LeaveRequests",data).then((resp)=>{
          console.log(resp.data);
          navigate("/leave-requests");
        }).catch((er)=>console.log(er))
    }
    const [reason, setReason] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
      };
    const [date, setDate] = React.useState<DateRange<Dayjs>>([dayjs(),dayjs()])
    const {
        register,
        handleSubmit,
        setError,
        formState:{errors}
    } = useForm({
        resolver: yupResolver(schema)
    })


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
                    Create leave request
              </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Absence reason</InputLabel>
                    <Select
                     {...register("absenceReason")}
                     error={!!errors.absenceReason}
                     
                     value={reason} label="Absence reason" onChange={handleChange} >
                        <MenuItem value={0}>Medical appointment leave</MenuItem>
                        <MenuItem value={1}>Family reasons</MenuItem>
                    </Select>
                    <FormHelperText sx={{color: "crimson"}}>{errors.absenceReason ? errors.absenceReason.message : ''}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                    <DateRangePicker value={date} onChange={(newDate)=>setDate(newDate)}  localeText={{ start: 'Start date', end: 'End date' }} minDate={dayjs()}
                    
                    slotProps={{
                        textField: {
                          required: true,
                        },
                      }}
                    />
                </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
              <TextField
                  label="Comment"
                  {...register('comment')}
                  fullWidth
                  multiline
                /> 
                
              </Grid>
              <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      <Button variant='contained' color="success" fullWidth type="submit">
                        Create
                    </Button>   
                      </Grid>
                      <Grid item xs={12}>
                      <Button variant="text" component={Link} to="/leave-requests" fullWidth>Back to list</Button>
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
  
  export default CreateLeaveRequest;
  