import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" gutterBottom textAlign="center" marginTop="2%">
                Welcome to Out of Company
            </Typography>
            <Typography variant="h5" gutterBottom textAlign="center" marginBottom="2%">
                Your ultimate solution for managing leave and time-off requests
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt="Manage Leaves"
                            height="140"
                            style={{ objectFit: 'contain' }}
                            image="http://127.0.0.1:10000/devstoreaccount1/employeeimages/LeaveRequests.jpg" // Замените на реальный путь к изображению
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Efficient Leave Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Easily apply for leaves and track your leave balance in real-time. Our intuitive interface ensures a seamless experience for both employees and managers.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt="Team Collaboration"
                            height="140"
                            style={{ objectFit: 'contain' }}
                            image="http://127.0.0.1:10000/devstoreaccount1/employeeimages/ApprovalRequests.jpg" // Замените на реальный путь к изображению
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Team Collaboration
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Keep everyone in the loop with our collaborative features. Managers can approve or reject leave requests, and employees can see who’s out of office.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt="Projects Management"
                            height="140"
                            image="http://127.0.0.1:10000/devstoreaccount1/employeeimages/Projects.jpg" // Замените на реальный путь к изображению
                            style={{ objectFit: 'contain' }}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Project Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create and manage projects efficiently. Add employees to projects, assign roles, and track progress with ease.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt="Employee Management"
                            height="140"
                            image="http://127.0.0.1:10000/devstoreaccount1/employeeimages/Employees.jpg" // Замените на реальный путь к изображению
                            style={{ objectFit: 'contain' }}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Employee Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage your workforce effectively. View employee details, assign projects, and keep track of their roles and responsibilities.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography variant="body1" paragraph marginTop="2%">
                At Out of Company, we understand the importance of balancing work and personal time. Our application is designed to make the process of requesting and managing leave as smooth and efficient as possible. With user-friendly features and robust reporting capabilities, we help you stay organized and maintain productivity.
            </Typography>
            <Typography variant="body1" paragraph>
                Join the growing number of companies who trust Out of Company for their leave management needs. Experience the difference today!
            </Typography>
            <Typography variant="body1" paragraph>
                To get started, please <Link to="/sign-in">log in</Link>.
            </Typography>
            <Grid container justifyContent="center" marginTop="2%">
                <Button variant="contained" color="primary" component={Link} to="/sign-in">
                    Sign In
                </Button>
            </Grid>
        </Container>
    );
};

export default Home;
