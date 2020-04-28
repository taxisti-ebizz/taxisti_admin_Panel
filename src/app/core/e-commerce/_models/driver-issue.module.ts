export class DriverIssueModule { 
    id: number;
    first_name: string;
    last_name: string;
    mobile_no: number;
    driver_rides_count : number;
    driver_cancel_ride_count: number;
    acceptance_ratio: number;
    rejected_ratio: number;
    online_hours_last_week: number;
    online_hours_current_week: number;
    total_online_hours: number;
    driver_total_review_count: number;
    driver_avg_rating_count: number;
    date_of_birth: Date;
    date_of_register: Date;
    device_type: string;
    verify: string;
}
