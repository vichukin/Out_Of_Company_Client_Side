import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { checkAccess, useEmployee } from '../EmployeeContext/EmployeeContext';
//@ts-ignore
import Cookies from 'js-cookie';
import {  Grid, Typography, Tab,Tabs,Toolbar,AppBar,Box } from '@mui/material';
import { PositionEnum } from '../../Classes/PositionEnum';

function Header() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate()

  const {employee, setEmployee} = useEmployee();
  const handleSignOut = () => {
    Cookies.remove('accessToken');
    setEmployee(null);
    setValue(3);
    navigate('/sign-in');
  };
  React.useEffect(() => {
      if(location.pathname.includes("/leave-requests")) setValue(0);
      else if(location.pathname.includes("/projects")) setValue(1);
      else if(location.pathname.includes("/employees")) setValue(3);
      else if(location.pathname.includes("/approval-requests")) setValue(2);
      else setValue(NaN)
  }, [location.pathname]);
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', width: '100%' }}>
      <Toolbar>
        <Link style={{textDecoration: "none"}} to={"/"}>
        
        <Typography variant="h6" component="div" sx={{ color: 'black', mr: 2 }}>
          Out Of Company
        </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            value={value}
            aria-label="nav tabs"
            textColor="inherit"
            indicatorColor="primary"
          >
            {employee && <Tab label="Leave Requests" component={Link} to="/leave-requests" />}
            
            { employee && <Tab label="Projects" component={Link} to="/projects" />}
            { (employee?.position == PositionEnum[1]|| employee?.position == PositionEnum[2] || employee?.position==PositionEnum[3]) && <Tab label="Approval requests" component={Link} to="/approval-requests" />}
            { (checkAccess(employee,[PositionEnum.HR_Manager,PositionEnum.Project_Manager])) && <Tab label="Employees" component={Link} to="/employees" />}
            {!employee ? (
              <Tab 
              label="Sign in" 
              color="inherit" 
              component={Link} 
              to="/sign-in" 
              
              style={{ marginLeft: "auto" }} 
              />
              ) : (
                <>
                <Grid container direction="column" marginLeft="auto"  width="max-content">
                  <Grid item>
                    <Typography variant='body1' textAlign="center"> {employee.fullname}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption'>{employee.position}</Typography>
                  </Grid>
                </Grid>
                <Tab label="Sign out" color="inherit" onClick={handleSignOut} ></Tab>
                </>
              )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
