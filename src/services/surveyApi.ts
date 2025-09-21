import { apiService } from './api';

export interface Survey {
    id: number;
    title: string;
    description: string;
    survey_type: string;
    is_anonymous: boolean;
    end_date: string;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'active' | 'closed';
    responses_count: number;
}

export interface SurveyQuestion {
    question_text: string;
    question_type: 'text' | 'rating' | 'choice' | 'boolean' | 'scale';
    choices?: string[];
    is_required: boolean;
}

export interface CreateSurveyRequest {
    title: string;
    description: string;
    survey_type: 'wellness' | 'feedback' | 'satisfaction' | 'skills' | 'goals' | 'engagement' | 'leadership' | 'project_feedback';
    start_date: string;
    end_date: string;
    target_audience: 'all_employees' | 'team_only' | 'by_department' | 'by_role' | 'by_risk_level' | 'custom_selection';
    target_roles?: string[];
    target_risk_levels?: string[];
    target_employees?: number[];
    target_departments?: string[];
    is_anonymous?: boolean;
    questions: SurveyQuestion[];
}

export interface UpdateSurveyRequest {
    title?: string;
    description?: string;
    status?: 'draft' | 'active' | 'closed';
}

class SurveyApiService {
    private baseUrl = `/surveys`;

    async getSurveys(): Promise<Survey[]> {
        const response = await apiService.get<Survey[]>('/surveys/');
        return response;
    }

    async getSurvey(id: number): Promise<Survey> {
        const response = await apiService.get<Survey>(`/surveys/${id}/`);
        return response;
    }

    async getSurveyManagement(): Promise<any> {
        const response = await apiService.get<any>('/survey-management/');
        return response;
    }

    async getMySurveyResponses(): Promise<any[]> {
        const response = await apiService.get<any[]>('/my-survey-responses/');
        return response;
    }

    async createSurvey(data: CreateSurveyRequest): Promise<any> {
        const response = await apiService.post<any>('/manager/publish-survey/', data);
        return response;
    }

    async updateSurvey(id: number, data: UpdateSurveyRequest): Promise<Survey> {
        const response = await apiService.put<Survey>(`${this.baseUrl}/${id}/`, data);
        return response;
    }

    async deleteSurvey(id: number): Promise<void> {
        await apiService.delete(`${this.baseUrl}/${id}/`);
    }

    async getSurveyResponses(id: number): Promise<any[]> {
        const response = await apiService.get<any[]>(`/surveys/${id}/responses/`);
        return response;
    }

    async submitSurveyResponse(id: number, responses: any[]): Promise<any> {
        const response = await apiService.post<any>(`/surveys/${id}/respond/`, { responses });
        return response;
    }
}

export const surveyApi = new SurveyApiService();
