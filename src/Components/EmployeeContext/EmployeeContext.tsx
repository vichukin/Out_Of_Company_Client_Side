import  { createContext, useContext, useState, ReactNode } from 'react';
import { PositionEnum } from '../../Classes/PositionEnum';
import { Project, mapToProjects } from '../../Classes/Project';
import { LeaveRequest, mapToLeaveRequests } from '../../Classes/LeaveRequest';
import { SubDivision } from '../../Classes/SubDivision';


export interface Employee {
  id: string;
  username: string;
  fullname: string;
  position: PositionEnum | string;
  subDivision: SubDivision | string;
  photoPath?: string | null;
  outOfOfficeBalance?: number;
  projects?: Project[];
  leaveRequests?: LeaveRequest[];
  peoplePartner?: Employee;
  employees?: Employee[];
}

interface EmployeeContextProps {
  employee: Employee | null;
  setEmployee: (employee: Employee | null) => void;
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within a EmployeeProvider');
  }
  return context;
};
export const mapToEmployee = (data: any): Employee => {
    return {
      id: data.id,
      username: data.userName,
      fullname: data.fullName == undefined ? data.fullname : data.fullName,
      position: PositionEnum[data.position],
      subDivision: SubDivision[data.subDivision],
      photoPath: data.photoPath ?? null,
      peoplePartner: data.peoplePartner ? mapToEmployee(data.peoplePartner): undefined,
      projects: data.projects ? mapToProjects(data.projects): undefined,
      employees: data.employees ? mapToEmployees(data.employees) : undefined,
      leaveRequests: data.leaveRequests ? mapToLeaveRequests(data.leaveRequests): undefined,
      outOfOfficeBalance: data.outOfOfficeBalance ?? null
    };
  };
  export const mapToEmployees = (data: any): Employee[] => {
    return data.map((item: any) => ( mapToEmployee(item)));
  };
  export const checkAccess = (employee: Employee | null, position: PositionEnum[]): boolean=>{
  if(employee?.position == PositionEnum[3])
      return true;
    else
    {
      for(var pos of position)
      {
        if(PositionEnum[pos] == employee?.position)
            return true;
      }
      return false;
    } 
  }
