// src/components/Employees.tsx
import { Box, Button, Container, Grid, Typography, Toolbar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Employee, checkAccess, mapToEmployees, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import EmployeeModal from './EmployeeModal';
import { PositionEnum } from '../../Classes/PositionEnum';

function Employees() {
  const navigate = useNavigate();
  const {employee,setEmployee} = useEmployee();
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    if(!checkAccess(employee,[PositionEnum.Project_Manager,PositionEnum.HR_Manager]))
        {
            navigate("/");
        }
    const getEmployees = () => {
      api.get("employee").then((resp) => {
        const ar = mapToEmployees(resp.data);
        console.log(ar);
        
        setRows(ar);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
    }
    getEmployees();
  }, []);
  
  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] as string : null;
    setSelectedRowId(selectedId);
  };

  const openEmployeeDetails = () => {
    const row = rows.find(t => t.id === selectedRowId);
    setSelectedEmployee(row!);
    setModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id" },
    { field: "username", headerName: "Username", width: 150 },
    { field: "fullname", headerName: "Fullname", width: 150 },
    { field: "peoplePartner", headerName: "People Partner", width: 150, valueGetter: (params, row) => row.peoplePartner?.fullname ?? '' },
    { field: "subDivision", headerName: "Sub Division", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
    { field: "outOfOfficeBalance", headerName: "Out Of Office Balance", width: 150 }
  ];

  return (
    <>
      {selectedEmployee && <EmployeeModal open={modalOpen} onClose={handleCloseModal} employee={selectedEmployee} />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleClose}
      >
        <Alert variant='filled' severity="error">{errorText}</Alert>
      </Snackbar>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Typography variant='h5'>Employees</Typography>
        </Grid>
        <Grid item xs={8}></Grid>
        {(checkAccess(employee,[PositionEnum.HR_Manager])) && <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/employees/register" color="success" style={{ marginLeft: "auto" }}>
          Register employee
          </Button>
        </Grid>}
        <Grid item xs={12}>
          <hr />
        </Grid>
        {selectedRowId && (
          <Grid item xs={12}>
            <Toolbar style={{ justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={openEmployeeDetails} color="primary" style={{ marginRight: 8 }}>Open</Button>
              { (checkAccess(employee,[PositionEnum.HR_Manager])) && <Button variant="contained" component={Link} to={`/employees/edit/${selectedRowId}`} color="secondary" style={{ marginRight: 8 }}>Edit</Button>}
            </Toolbar>
          </Grid>
        )}
        {
          loading ?
            <Grid item xs={12}>
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
                pageSizeOptions={[10, 25, 50]}
              />
            </Grid>
        }
      </Grid>
    </>
  );
}

export default Employees;
