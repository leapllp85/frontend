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
    id: number;
    question: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'boolean' | 'scale';
    options?: string[];
    required: boolean;
}

export interface CreateSurveyRequest {
    title: string;
    description: string;
    status: 'draft' | 'active' | 'closed';
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
        const response = await apiService.get<Survey>(`${this.baseUrl}/${id}/`);
        return response;
    }

    async createSurvey(data: CreateSurveyRequest): Promise<Survey> {
        const response = await apiService.post<Survey>(`${this.baseUrl}/`, data);
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
        const response = await apiService.get<any[]>(`${this.baseUrl}/${id}/responses/`);
        return response;
    }
}

export const surveyApi = new SurveyApiService();
