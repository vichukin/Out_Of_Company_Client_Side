import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Avatar } from '@mui/material';
import { Employee } from '../../Components/EmployeeContext/EmployeeContext';
import { PositionEnum } from '../../Classes/PositionEnum';
import { SubDivision } from '../../Classes/SubDivision';

interface EmployeeModalProps {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ open, onClose, employee }) => {
    if (!employee) {
        return null;
    }

    const { id, username, fullname, position, subDivision, photoPath, peoplePartner } = employee;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Avatar 
                                src={photoPath || 'http://127.0.0.1:10000/devstoreaccount1/employeeimages/avatar-default.svg'} 
                                alt={fullname} 
                                sx={{ width: 100, height: 100 }} 
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography><strong>ID:</strong> {id}</Typography>
                            <Typography><strong>Username:</strong> {username}</Typography>
                            <Typography><strong>Fullname:</strong> {fullname}</Typography>
                            <Typography><strong>Position:</strong> {typeof position === 'string' ? position : PositionEnum[position]}</Typography>
                            <Typography><strong>SubDivision:</strong> {typeof subDivision === 'string' ? subDivision : SubDivision[subDivision]}</Typography>
                            <Typography><strong>People partner:</strong> {peoplePartner?.fullname}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeModal;
