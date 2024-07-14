// src/components/LeaveRequests.js
import {  Button, Grid, Typography, Toolbar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { DataGrid, GridColDef,GridRowSelectionModel } from '@mui/x-data-grid';
import { mapToLeaveRequests, LeaveRequest } from '../../Classes/LeaveRequest';
import { RequestStatus } from '../../Classes/RequestStatus';
import LeaveRequestModal from './LeaveRequestModal';

function LeaveRequests() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [rows,setRows] = React.useState<LeaveRequest[]>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState<LeaveRequest | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLeaveRequest(null);
};
  const handleClose = ()=>{
    setOpen(false);
  }
  useEffect(()=>{
    const getLeaveRequests = ()=>{
      api.get("leaveRequests").then((resp)=>{
        const ar = mapToLeaveRequests(resp.data);
        console.log(ar)
        setRows(ar);
        setLoading(false);
      }).catch((error) => console.log(error))
      
    }
    getLeaveRequests();
  },[]
  )
  const submitLeaveRequest = ()=>{
    var row = rows!.find(t=>t.id==selectedRowId);
    if(row?.requestStatus==RequestStatus[RequestStatus.Approved] || row?.requestStatus==RequestStatus[RequestStatus.Rejected])
    {
      setErrorText("You can't submit approved or rejected request");
      setOpen(true);
    }
    else
    {
      api.post(`leaveRequests/submitRequest/${selectedRowId}`).then(resp=>{
        console.log(resp.data);
        row!.requestStatus = RequestStatus[RequestStatus.Submitted];
        navigate("/leave-requests");
      }).catch((error)=>console.log(error.message));
    }
    
    
  }
  const cancelLeaveRequest = ()=>{
    
    var row = rows!.find(t=>t.id==selectedRowId);
    if(row?.requestStatus==RequestStatus[RequestStatus.Rejected])
    {
      setErrorText("You can't cancel rejected request");
      setOpen(true);
    }
    else
    {
    api.post(`leaveRequests/cancelRequest/${selectedRowId}`).then(resp=>{
      console.log(resp.data);
      row!.requestStatus = RequestStatus[RequestStatus.Canceled];
      navigate("/leave-requests");
    }).catch((error)=>console.log(error));
    }
    
  }
  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] as number : null;
    setSelectedRowId(selectedId);
  };
  const openLeaveRequest = ()=>{
    var row = rows!.find(t=>t.id==selectedRowId);
    console.log(row);
    
    setSelectedLeaveRequest(row!);
    setModalOpen(true);
  }
  const openEditTab = ()=>{
    var row = rows!.find(t=>t.id==selectedRowId);
    if(row?.requestStatus==RequestStatus[RequestStatus.Approved] || row?.requestStatus==RequestStatus[RequestStatus.Rejected])
    {
      setErrorText("You can't edit approved or rejected request");
      setOpen(true);
      return;
    }
    navigate(`/leave-requests/edit/${selectedRowId}`);
  }
  const columns: GridColDef[] =
  [
    {field: "id",headerName:"Id"},
    {field: "fullname",headerName:"Employee fullname", width: 150},
    {field: "absenceReason",headerName:"Absence reason", width: 150},
    {field: "startDate",headerName:"Start date"},
    {field: "endDate",headerName:"End date"},
    {field: "comment",headerName:"Comment", width: 400},
    {field: "requestStatus",headerName:"Request status", width: 150}
  ]
  
  return (
    
    <>
    {selectedLeaveRequest && <LeaveRequestModal open={modalOpen} onClose={handleCloseModal} leaveRequest={selectedLeaveRequest} />}
      <Snackbar
        anchorOrigin={{vertical:"top",horizontal:"right"}}
        open={open}
        onClose={handleClose}
      >
       <Alert variant='filled' severity="error">{errorText}</Alert> 
      </Snackbar>
      <Grid container spacing={1}>
          <Grid item xs={4}>
              <Typography variant='h5'>Leave Requests</Typography>
          </Grid>
          <Grid item  xs={8} >
          </Grid>
          <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/leave-requests/create" color="success"  style={{marginLeft: "auto"}}>
              Create
          </Button>
          </Grid>
          <Grid item xs={12}>
          <hr/>
          </Grid>
          {selectedRowId && (
          <Grid item xs={12}>
            <Toolbar style={{ justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={openLeaveRequest} color="primary" style={{ marginRight: 8 }}>Open</Button>
              <Button variant="contained" onClick={openEditTab} color="secondary" style={{ marginRight: 8 }}>Edit</Button>
              <Button variant="contained" onClick={submitLeaveRequest} color="success" style={{ marginRight: 8 }}>Submit</Button>
              <Button variant="contained" onClick={cancelLeaveRequest} color="error">Cancel</Button>
            </Toolbar>
          </Grid>
        )}
        {
          loading ?
          <Grid item xs={12} >
                <Grid container justifyContent="center">
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
          </Grid>
          :
          <Grid item xs={12}>
          <DataGrid
          rows={rows}
          columns={columns}
          onRowSelectionModelChange={handleRowSelection}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10,25, 50]}
        />
      
          </Grid>
        }
      
      
      </Grid>
    </>
    

  );
}

export default LeaveRequests;
