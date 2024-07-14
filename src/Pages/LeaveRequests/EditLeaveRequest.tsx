import  { useEffect, useState } from 'react';
import { Button, FormHelperText, FormControl, Grid, InputLabel, Select, TextField, Typography, MenuItem, CircularProgress } from '@mui/material';
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { DateRange } from '@mui/x-date-pickers-pro';

function EditLeaveRequest() {
    const schema = yup.object().shape({
        absenceReason: yup.string().required("Absence reason is required!"),
        comment: yup.string().notRequired()
    });

    const navigate = useNavigate();
    const { leaveRequestId } = useParams<{ leaveRequestId: string }>();
    const [absenceReason, setAbsenceReason] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [date, setDate] = useState<DateRange<Dayjs>>([dayjs(), dayjs()]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLeaveRequest = async () => {
            api.get(`LeaveRequests/${leaveRequestId}`).then((resp) => {
                const data = resp.data;
                setAbsenceReason(data.absenceReason.toString());
                setComment(data.comment || '');
                setDate([dayjs(data.startDate), dayjs(data.endDate)]);
                setValue("absenceReason", data.absenceReason);
                setValue("comment", data.comment);
                setLoading(false);
            }).catch((error) => {
                console.error('Failed to fetch leave request', error);
                navigate('/leave-requests');
            });
        };

        getLeaveRequest();
    }, [leaveRequestId]);

    const onSubmit = (data: any) => {
        data.startDate = date[0]?.format('YYYY-MM-DD');
        data.endDate = date[1]?.format('YYYY-MM-DD');
        data.absenceReason = +data.absenceReason;
        console.log(data);
        
        api.put(`LeaveRequests/${leaveRequestId}`, data).then( ()=> {
            navigate("/leave-requests");
        });
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <>
            {
                loading ?
                    <div style={{ left: "48%", top: "48%", position: "absolute" }}>
                        <CircularProgress />
                    </div>
                    :
                    <Grid container spacing={2} marginTop={"3%"}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant='h5' textAlign="center">
                                            Edit Leave Request
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Absence reason</InputLabel>
                                            <Select
                                                {...register("absenceReason")}
                                                error={!!errors.absenceReason}
                                                value={absenceReason}
                                                label="Absence reason"
                                                onChange={(e) => setAbsenceReason(e.target.value as string)}
                                            >
                                                <MenuItem value={0}>Medical appointment leave</MenuItem>
                                                <MenuItem value={1}>Family reasons</MenuItem>
                                            </Select>
                                            <FormHelperText sx={{ color: "crimson" }}>{errors.absenceReason ? errors.absenceReason.message : ''}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateRangePicker
                                                value={date}
                                                onChange={(newDate) => setDate(newDate)}
                                                localeText={{ start: 'Start date', end: 'End date' }}
                                                minDate={dayjs()}
                                                slotProps={{
                                                    textField: {
                                                        required: true,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Comment"
                                            {...register('comment')}
                                            fullWidth
                                            multiline
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Button variant='contained' color="success" fullWidth type="submit">
                                                    Save
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
            }
        </>
    );
}

export default EditLeaveRequest;
