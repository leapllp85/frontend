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

export interface SurveysPaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        surveys?: Survey[];
        summary?: any;
        user_info?: any;
        total_results?: number;
        search_query?: string;
    };
}

export interface SurveysQueryParams {
    page?: number;
    page_size?: number;
    search?: string;
}

class SurveyApiService {
    private baseUrl = `/surveys`;

    // Get surveys with pagination
    async getSurveys(params?: SurveysQueryParams): Promise<SurveysPaginatedResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.page_size) {
            queryParams.append('page_size', params.page_size.toString());
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        
        const url = `/surveys/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await apiService.get<SurveysPaginatedResponse>(url);
    }

    // Get published surveys with pagination
    async getPublishedSurveys(params?: SurveysQueryParams): Promise<SurveysPaginatedResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.page_size) {
            queryParams.append('page_size', params.page_size.toString());
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        
        const url = `/surveys/publish/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await apiService.get<SurveysPaginatedResponse>(url);
    }

    // Get survey management with pagination
    async getSurveyManagement(params?: SurveysQueryParams): Promise<SurveysPaginatedResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.page_size) {
            queryParams.append('page_size', params.page_size.toString());
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        
        const url = `/surveys/manage/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await apiService.get<SurveysPaginatedResponse>(url);
    }

    // Legacy methods for backward compatibility
    async getAllSurveys(): Promise<Survey[]> {
        const response = await this.getSurveys();
        return response.results.surveys || [];
    }

    async getSurvey(id: number): Promise<Survey> {
        const response = await apiService.get<Survey>(`/surveys/${id}/`);
        return response;
    }

    // Legacy method - use getSurveyManagement() with pagination instead
    async getSurveyManagementLegacy(): Promise<any> {
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
