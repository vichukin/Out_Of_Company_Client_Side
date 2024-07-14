import { Employee, mapToEmployee } from "../Components/EmployeeContext/EmployeeContext";
import { LeaveRequest, mapToLeaveRequest } from "./LeaveRequest";
import { RequestStatus } from "./RequestStatus";

export interface ApproveRequest
{
    id: number;
    approver?: Employee;
    comment?: string;
    leaveRequest?: LeaveRequest;
    leaveRequestId?: number;
    requestStatus: RequestStatus|string;
}
export const mapToAprovalRequest = (data: any): ApproveRequest => {
    return {
      id: data.id,
      approver: data.approver!=null?mapToEmployee(data.approver): undefined,
      comment: data.comment ?? '',
      leaveRequest: data.leaveRequest !=null ? mapToLeaveRequest(data.leaveRequest) : undefined ,
      leaveRequestId: data.leaveRequestId ?? null,
      requestStatus: typeof data.requestStatus === "string" ? data.requestStatus: RequestStatus[data.requestStatus] 
    };
  };
  
  export const mapToAprovalRequests = (data: any[]): ApproveRequest[] => {
    return data.map(mapToAprovalRequest);
  };