import { string } from "yup";
import { AbsenceReason } from "./AbesenceReason";
import { ApproveRequest as ApprovalRequest, mapToAprovalRequest as mapToApprovalRequest } from "./ApprovalRequest";
import { RequestStatus } from "./RequestStatus";

export interface LeaveRequest {
    id: number;
    fullname: string;
    absenceReason: AbsenceReason | string;
    startDate: Date | string;
    endDate: Date | string;
    comment?: string;
    requestStatus: RequestStatus | string;
    approvalRequest?: ApprovalRequest;
}
const mapToLeaveRequest = (data: any): LeaveRequest => {
  return {
    id: data.id,
    fullname: data.employee  ? data.employee.fullName : data.fullname,
    absenceReason: typeof data.absenceReason === "string" ? data.absenceReason: AbsenceReason[data.absenceReason],
    startDate: typeof data.startDate === "string" ? data.startDate : new Date(data.startDate).toLocaleDateString(undefined, { year: "numeric", day: "numeric", month: "numeric" }),
    endDate: typeof data.endDate === "string" ? data.endDate :  new Date(data.endDate).toLocaleDateString(undefined, { year: "numeric", day: "numeric", month: "numeric" }),
    requestStatus:typeof data.requestStatus === "string" ? data.requestStatus: RequestStatus[data.requestStatus],
    comment: data.comment ?? null,
    approvalRequest: data.approvalRequest ? mapToApprovalRequest(data.approvalRequest) : undefined
  };
};
const mapToLeaveRequests = (dataArray: any[]): LeaveRequest[] => {
  return dataArray.map(data => mapToLeaveRequest(data));
};
export  {mapToLeaveRequest, mapToLeaveRequests}