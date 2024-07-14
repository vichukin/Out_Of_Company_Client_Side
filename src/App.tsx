import { useState,useEffect } from 'react'
import Header from './Components/header/header'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LeaveRequests from './Pages/LeaveRequests/LeaveRequests';
import Projects from './Pages/Projects/Projects';
import Employees from './Pages/Employees/Employees';
import SignIn from './Pages/SignIn/Signin';
import { Box, CircularProgress } from '@mui/material';
import AuthGuard from './Components/AuthGuard/AuthGuard';
import {  mapToEmployee, useEmployee } from './Components/EmployeeContext/EmployeeContext';
//@ts-ignore
import Cookies from 'js-cookie';
import api from './Components/AxiosConfig/AxiosConfig';
import CreateLeaveRequest from './Pages/LeaveRequests/CreateLeaveRequest';
import CreateProject from './Pages/Projects/CreateProject';
import AprovalRequests from './Pages/ApprovalRequests/ApprovalRequests';
import RegisterEmployee from './Pages/Employees/RegisterEmployee';
import EditProject from './Pages/Projects/EditProject';
import EditLeaveRequest from './Pages/LeaveRequests/EditLeaveRequest';
import EditEmployee from './Pages/Employees/EditEmployee';

function App() {
  const { setEmployee } = useEmployee();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    
    const getEmployeeInfo= ()=>{
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        if(location.pathname != "/")
          navigate('/sign-in');
        setLoading(false);
        return;
      }
      api.get("/Authentication/GetEmployeeInfo").then(resp=>
        {
          const employee = mapToEmployee(resp.data);
          setEmployee(employee);
        }).finally(()=>setLoading(false));
    }
    getEmployeeInfo();
  },[navigate,setEmployee])
  if (loading) {
    return <div style={{left:"48%", top:"48%",position:"absolute"}}>
      <CircularProgress  />
    </div>;
  }
  return (
    <>
      <Header />
      <div style={{ paddingTop: '64px' }}>
      <Box component="section" marginLeft={"5%"} marginRight={"5%"}>
        <Routes>
          <Route path='/approval-requests' element={<AprovalRequests></AprovalRequests>}> </Route>
          <Route path="/leave-requests" element={ <LeaveRequests /> } />
          <Route path="/leave-requests/create" element={ <CreateLeaveRequest /> } />
          <Route path="/leave-requests/edit/:leaveRequestId" element={<EditLeaveRequest />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={ <CreateProject /> } />
          <Route path="/projects/edit/:projectId" element={<EditProject />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/register" element={<RegisterEmployee />} />
          <Route path="/employees/edit/:employeeId" element={<EditEmployee />} />
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
        </Box>
      </div>
    </>
  )
}

export default App
