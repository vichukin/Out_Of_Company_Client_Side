// src/components/Projects.js
import React, { useEffect } from 'react';
import { Box, Button, Container, Grid, Typography, Toolbar, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Components/AxiosConfig/AxiosConfig';
import { DataGrid, GridColDef,GridRowSelectionModel } from '@mui/x-data-grid';
import { Project, mapToProjects } from '../../Classes/Project';
import { checkAccess, useEmployee } from '../../Components/EmployeeContext/EmployeeContext';
import { PositionEnum } from '../../Classes/PositionEnum';
import { ProjectStatus } from '../../Classes/ProjectStatus';
import ProjectModal from './ProjectModal';

function Projects() {
  const [loading, setLoading] = React.useState(true);
  const {employee, setEmployee} = useEmployee();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [project,setProject] = React.useState<Project>();

  const handleCloseModal = () => {
    setModalOpen(false);
    setProject(undefined);
  };
  const HandleOpenModal = ()=>{
    var row = rows!.find(t=>t.id==selectedRowId);
    setProject(row);
    setModalOpen(true)
  }
  

  const navigate = useNavigate();
  useEffect(()=>{
    const getLeaveRequests = ()=>{
      api.get("Projects").then((resp)=>{
        const ar = mapToProjects(resp.data);
        console.log(ar)
        setRows(ar);
        setLoading(false);
      }).catch((error) => console.log(error))
      
    }
    getLeaveRequests();
  },[]
  )
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'projectType', headerName: 'Project Type', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'projectManagerFullname', headerName: 'Project manager', width: 200 },
    { field: 'comment', headerName: 'Comment', width: 200 },
    { field: 'projectStatus', headerName: 'Project Status', width: 150 }
  ];
  const [rows,setRows] = React.useState<Project[]>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  useEffect(()=>{
    const getProjects = ()=>{
      api.get("Projects").then((resp)=>{
        console.log(resp.data)
        setRows(mapToProjects(resp.data));
      })
    }
    getProjects();
  },[])
  const ActiveProject = ()=>{
    api.patch(`Projects/Active/${selectedRowId}`).then((resp)=>{
      var row = rows!.find(t=>t.id==selectedRowId);
      row!.projectStatus = ProjectStatus[ProjectStatus.Active];
      row!.endDate = "To present";
      navigate("/projects");
    })
  }
  const InactiveProject = ()=>{
    api.patch(`Projects/Inactive/${selectedRowId}`).then((resp)=>{
      var row = rows!.find(t=>t.id==selectedRowId);
      row!.projectStatus = ProjectStatus[ProjectStatus.Inactive];
      row!.endDate = new Date().toISOString().split("T")[0];
      navigate("/projects");
    })
  }
  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] as number : null;
    setSelectedRowId(selectedId);
  };
  return (

    <>
    {project && <ProjectModal open={modalOpen} onClose={handleCloseModal} project={project}></ProjectModal>}
    <Grid container spacing={1}>
        <Grid item xs={4}>
            <Typography variant='h5'>Projects</Typography>
        </Grid>
        <Grid item  xs={8} >
        </Grid>
        { (employee?.position==PositionEnum[2]|| employee?.position==PositionEnum[3])&&
          <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/projects/create" color="success"  style={{marginLeft: "auto"}}>
              Create
          </Button>
          </Grid>
        }
        <Grid item xs={12}>
        <hr/>
        </Grid>
        {selectedRowId && (
        <Grid item xs={12}>
          <Toolbar style={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={HandleOpenModal} color="primary" style={{ marginRight: 8 }}>Open</Button>
            { checkAccess(employee, [PositionEnum.Project_Manager]) && <><Button variant="contained" component={Link} to={`/projects/edit/${selectedRowId}`} color="secondary" style={{ marginRight: 8 }}>Edit</Button>
            <Button variant="contained" onClick={ActiveProject} color="success" style={{ marginRight: 8 }}>Active</Button>
            <Button variant="contained" onClick={InactiveProject} color="error">Inactive</Button></>}
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

export default Projects;
