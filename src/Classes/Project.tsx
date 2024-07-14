import {Employee, mapToEmployee, mapToEmployees} from "../Components/EmployeeContext/EmployeeContext";
import { ProjectStatus } from "./ProjectStatus";
import { ProjectType } from "./ProjectType";


export interface Project {
    id: number;
    projectType: ProjectType | string;
    startDate: string; 
    endDate?: string | null; 
    projectManager: Employee;
    comment?: string | null;
    projectStatus: ProjectStatus| string;
    projectManagerFullname: string;
    members?: Employee[];
  }
  export const mapToProject = (item: any): Project =>{
    return {
      id: item.id,
      projectType: ProjectType[item.projectType],
      startDate: item.startDate.toString(),
      endDate: item.endDate ? item.endDate.toString() : "To present",
      projectManager: mapToEmployee(item.projectManager),
      comment: item.comment ?? null,
      projectStatus: ProjectStatus[item.projectStatus],
      projectManagerFullname: item.projectManager.fullName,
      members: item.members && mapToEmployees(item.members)
    }
  }
  export const mapToProjects = (data: any[]): Project[] => {
    return data.map((item: any) => (
      mapToProject(item)
    ));
  };