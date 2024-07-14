// src/components/AproveRequests.js
import { Box, Button, Container, Grid, Typography, Toolbar, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { mapToAprovalRequests as mapToApprovalRequests, ApproveRequest } from '../../Classes/ApprovalRequest';
import { RequestStatus } from '../../Classes/RequestStatus';
import { LeaveRequest, mapToLeaveRequest } from '../../Classes/LeaveRequest';
import { AbsenceReason } from '../../Classes/AbesenceReason';
import { Employee, checkAccess, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import { PositionEnum } from '../../Classes/PositionEnum';
import LeaveRequestModal from '../LeaveRequests/LeaveRequestModal';
import TextArea from '../../Components/TextArea/TextArea';

function AprovalRequests() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState<LeaveRequest | null>(null);

  const [rows, setRows] = React.useState<ApproveRequest[]>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const {employee,setEmployee} = useEmployee();
  const [open, setOpen] = React.useState(false);
  
  const [loading, setLoading] = React.useState(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLeaveRequest(null);
};
const openLeaveRequest = ()=>{
  var row = rows!.find(t=>t.id==selectedRowId);
  const leaveReq = mapToLeaveRequest(row?.leaveRequest);
  console.log(leaveReq);
  
  setSelectedLeaveRequest(leaveReq);
  setModalOpen(true);
}
  const handleClose = ()=>{
    setOpen(false);
  }
  useEffect(() => {
    if(!checkAccess(employee,[PositionEnum.Project_Manager,PositionEnum.HR_Manager]))
        {
            navigate("/");
        }
    const getApprovalRequests = () => {
      api.get("approvalRequests").then((resp) => {
        console.log(resp.data);
        const ar = mapToApprovalRequests(resp.data);
        setRows(ar);
        setLoading(false);
      }).catch((error) => console.log(error));
    };
    getApprovalRequests();
  }, []);

  const approveRequest = (withComment: boolean) => {
    setOpenComment(false)
    var row = rows!.find(t=>t.id==selectedRowId);
    

    var approvComment = null;
    if(withComment)
      approvComment = comment
    api.patch(`approvalRequests/approve`,{Id: selectedRowId, Comment: approvComment}).then(resp => {
      console.log(resp.data);
      row!.requestStatus = RequestStatus[RequestStatus.Approved]
      row!.approver = employee!;
      row!.leaveRequest!.approvalRequest!.approver = employee!;
      row!.leaveRequest!.approvalRequest!.requestStatus = RequestStatus[RequestStatus.Approved];
      // ADD COMMENT
      row!.leaveRequest!.approvalRequest!.comment = comment;
      navigate("/approval-requests");
    }).catch((error) => {
      if(error.response.data.error = "Not enought on employee balance")
        {
          console.log("balance error");
          setErrorText("The employee has insufficient Out Of Office Balance for this leave request.")
          setOpen(true);
        }
    });
  };
  const [errorText,setErrorText] = React.useState('');
  const rejectRequest = (withComment: boolean) => {
    setOpenComment(false)
    var row = rows!.find(t=>t.id==selectedRowId);
    
    var approvComment = null;
    if(withComment)
      approvComment = comment
    api.patch(`approvalRequests/reject`, {Id: selectedRowId, Comment: approvComment}).then(resp => {
      console.log(resp.data);
      row!.requestStatus = RequestStatus[RequestStatus.Rejected]
      row!.approver = employee!;
      row!.leaveRequest!.approvalRequest!.approver = employee!;
      row!.leaveRequest!.approvalRequest!.requestStatus = RequestStatus[RequestStatus.Rejected];
      // ADD COMMENT
      row!.leaveRequest!.approvalRequest!.comment = comment;
      navigate("/approval-requests");
    }).catch((error) => 
    {
      console.log("error: ", error)
      
    });
  };

  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] as number : null;
    setSelectedRowId(selectedId);
  };
  const [status,setStatus] = React.useState<RequestStatus>();
  const [openComment, setOpenComment] = React.useState(false);
  const [comment,setComment] = React.useState('');
  const changeStatusWithComment = (status: RequestStatus)=>{
    var row = rows!.find(t=>t.id==selectedRowId);
    if(row?.requestStatus==RequestStatus[RequestStatus.Canceled] || row?.requestStatus==RequestStatus[RequestStatus.Approved] || row?.requestStatus==RequestStatus[RequestStatus.Rejected])
    {
      if(status==RequestStatus.Rejected)
        setErrorText("You can't reject canceled, approved or rejected request");
      if(status == RequestStatus.Approved)
        setErrorText("You can't approve canceled, approved or rejected request");
      setOpen(true);
      return;
    }

    setStatus(status);
    setOpenComment(true);

  }
  const handleCloseComment = ()=>{
    setOpenComment(false);
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 25},
    { field: 'approver.fullname', headerName: 'Approver', width: 150, valueGetter: (value, row: ApproveRequest) => row.approver? row.approver.fullname : ""},
    { field: 'leaveRequest.fullname', headerName: 'Employee fullname', width: 150,  valueGetter: (value, row: ApproveRequest) => row.leaveRequest?.fullname},
    { field: 'leaveRequest.absenceReason', headerName: 'Absence reason', width: 150,valueGetter: (value, row: ApproveRequest) => row.leaveRequest?.absenceReason},
    { field: 'leaveRequest.startDate', headerName: 'Start date',valueGetter: (value, row: ApproveRequest) => row.leaveRequest?.startDate} ,
    { field: 'leaveRequest.endDate', headerName: 'End date',valueGetter: (value, row: ApproveRequest) => row?.leaveRequest?.endDate},
    { field: 'leaveRequest.comment', headerName: 'Comment', width: 250,valueGetter: (value, row: ApproveRequest) => row.leaveRequest?.comment} ,
    { field: 'requestStatus', headerName: 'Request status', width: 150 }
  ];

  return (
    <>
    {selectedLeaveRequest && <LeaveRequestModal open={modalOpen} onClose={handleCloseModal} leaveRequest={selectedLeaveRequest} />}
    {status&& 
    <Dialog open={openComment} onClose={handleCloseComment}>
      <DialogTitle>
        Do you want to leave comment?
      </DialogTitle>
      <DialogContent>
        <TextArea placeholder="Comment" onChange={(e: any)=>setComment(e.target.value)}></TextArea>
      </DialogContent>
      <DialogActions>
        <Button onClick={ status == RequestStatus.Approved ? (e)=>approveRequest(false) : (e)=> rejectRequest(false)} color="primary">No</Button>
        <Button onClick={ status == RequestStatus.Approved ? (e)=>approveRequest(true) : (e)=> rejectRequest(true)} color="success">Leave</Button>
      </DialogActions>
    </Dialog>}
    <Snackbar
        anchorOrigin={{vertical:"top",horizontal:"right"}}
        open={open}
        onClose={handleClose}
      >
       <Alert variant='filled' severity="error">{errorText}</Alert> 
      </Snackbar>
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Typography variant='h5'>Approval Requests</Typography>
      </Grid>
      <Grid item xs={8}>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      {selectedRowId && (
        <Grid item xs={12}>
          <Toolbar style={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={openLeaveRequest} color="primary" style={{ marginRight: 8 }}>Open</Button>
            <Button variant="contained" onClick={(e)=>changeStatusWithComment(RequestStatus.Approved)} color="success" style={{ marginRight: 8 }}>Approve</Button>
            <Button variant="contained" onClick={(e)=>changeStatusWithComment(RequestStatus.Rejected)} color="error">Reject</Button>
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

export default AprovalRequests;
