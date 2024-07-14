import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Avatar } from '@mui/material';

import { Project } from '../../Classes/Project';
import { ProjectStatus } from '../../Classes/ProjectStatus';
import { ProjectType } from '../../Classes/ProjectType';

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, project }) => {
    if (!project) {
        return null;
    }

    const { id, projectType, startDate, endDate, projectManager, comment, projectStatus,members } = project;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Project Details</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="h6">Project Info</Typography>
                    <Typography><strong>ID:</strong> {id}</Typography>
                    <Typography><strong>Project Type:</strong> {typeof projectType === 'string' ? projectType : ProjectType[projectType]}</Typography>
                    <Typography><strong>Start Date:</strong> {startDate}</Typography>
                    {endDate && <Typography><strong>End Date:</strong> {endDate}</Typography>}
                    <Typography><strong>Comment:</strong> {comment || 'N/A'}</Typography>
                    <Typography><strong>Project Status:</strong> {typeof projectStatus === 'string' ? projectStatus : ProjectStatus[projectStatus]}</Typography>
                </Box>
                <Box mt={2}>
                    <Typography variant="h6">Project Manager Info</Typography>
                    <Typography><strong>ID:</strong> {projectManager.id}</Typography>
                    <Typography><strong>Fullname:</strong> {projectManager.fullname}</Typography>
                </Box>
                {members && <Box mt={2}>
                    <Typography variant="h6">Members:</Typography>
                    <Grid container spacing={3} justifyItems="center">
                    {
                        members?.map((member)=>(
                            <Grid item  xs={3}>
                                <Avatar 
                                src={member.photoPath || 'http://127.0.0.1:10000/devstoreaccount1/employeeimages/avatar-default.svg'} 
                                alt={member.fullname} 
                                sx={{ width: "100%", height: "100%" }} 
                                />
                                <Typography textAlign="center">{member.fullname}</Typography>
                            </Grid>
                        ))
                    }
                    </Grid>
                </Box>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectModal;