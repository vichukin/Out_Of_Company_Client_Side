import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { LeaveRequest } from '../../Classes/LeaveRequest';
import { ApproveRequest } from '../../Classes/ApprovalRequest';
import { Employee } from '../../Components/EmployeeContext/EmployeeContext';
interface LeaveRequestModalProps {
    open: boolean;
    onClose: () => void;
    leaveRequest: LeaveRequest | null;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ open, onClose, leaveRequest }) => {
    if (!leaveRequest) {
        return null;
      }
    const { id, fullname, absenceReason, startDate, endDate, comment, requestStatus, approvalRequest } = leaveRequest;
    console.log(approvalRequest?.approver);
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="h6">Leave Request Info</Typography>
                    <Typography><strong>ID:</strong> {id}</Typography>
                    <Typography><strong>Fullname:</strong> {fullname}</Typography>
                    <Typography><strong>Absence Reason:</strong> {absenceReason}</Typography>
                    <Typography><strong>Start Date:</strong> {startDate.toString()}</Typography>
                    <Typography><strong>End Date:</strong> {endDate.toString()}</Typography>
                    <Typography><strong>Comment:</strong> {comment}</Typography>
                    <Typography><strong>Request Status:</strong> {requestStatus}</Typography>
                </Box>
                { approvalRequest && (
                    <Box mt={2}>
                        <Typography variant="h6">Approval Request Info</Typography>
                        <Typography><strong>ID:</strong> {approvalRequest.id}</Typography>
                        {approvalRequest.approver && (
                            //@ts-ignore
                            <Typography><strong>Approver:</strong> {approvalRequest.approver.fullname}</Typography>
                        )}
                        <Typography><strong>Comment:</strong> {approvalRequest.comment}</Typography>
                        <Typography><strong>Leave Request ID:</strong> {id}</Typography>
                        <Typography><strong>Request Status:</strong> {approvalRequest.requestStatus}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeaveRequestModal;
