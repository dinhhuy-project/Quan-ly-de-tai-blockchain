import axios, { AxiosInstance, AxiosError } from 'axios';
import { Topic, Progress, Evaluation, ApprovalStatus, ChangeHistory } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiClient {
  private client: AxiosInstance;
  private organization: 'org1' | 'org2' = 'org1';

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 10000,
    });

    // Add request interceptor to include organization header
    this.client.interceptors.request.use((config) => {
      config.headers['x-org'] = this.organization;
      return config;
    });

    // Add response error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        throw error;
      }
    );
  }

  setOrganization(org: 'org1' | 'org2') {
    this.organization = org;
  }

  // ==================== STUDENT OPERATIONS ====================

  async registerTopic(topic: Omit<Topic, 'status' | 'createdAt'>): Promise<Topic> {
    const response = await this.client.post('/topics/register', topic);
    return response.data.data;
  }

  async updateProgress(topicId: string, progress: Omit<Progress, 'topicId' | 'updatedAt'>): Promise<Progress> {
    const response = await this.client.put(`/topics/${topicId}/progress`, progress);
    return response.data.data;
  }

  async getApprovalStatus(topicId: string): Promise<ApprovalStatus> {
    const response = await this.client.get(`/topics/${topicId}/approval-status`);
    return response.data.data;
  }

  async getChangeHistory(topicId: string): Promise<ChangeHistory[]> {
    const response = await this.client.get(`/topics/${topicId}`);
    const topic = response.data.data;
    return topic.history || [];
  }

  // ==================== SUPERVISOR OPERATIONS ====================

  async approveTopic(topicId: string, supervisorId: string, supervisorName: string, comments: string): Promise<Topic> {
    const response = await this.client.put(`/topics/${topicId}/approve`, {
      supervisorId,
      supervisorName,
      comments,
    });
    return response.data.data;
  }

  async rejectTopic(topicId: string, supervisorId: string, supervisorName: string, reason: string): Promise<Topic> {
    const response = await this.client.put(`/topics/${topicId}/reject`, {
      supervisorId,
      supervisorName,
      reason,
    });
    return response.data.data;
  }

  async addEvaluation(topicId: string, evaluation: Omit<Evaluation, 'timestamp'>): Promise<void> {
    await this.client.post(`/topics/${topicId}/evaluation`, evaluation);
  }

  async trackProgress(topicId: string): Promise<Progress> {
    const response = await this.client.get(`/topics/${topicId}/progress`);
    return response.data.data;
  }

  // ==================== COMMON OPERATIONS ====================

  async getTopics(): Promise<Topic[]> {
    const response = await this.client.get('/topics');
    return response.data.data;
  }

  async getTopicById(topicId: string): Promise<Topic> {
    const response = await this.client.get(`/topics/${topicId}`);
    return response.data.data;
  }

  async getTopicsByStudent(studentId: string): Promise<Topic[]> {
    const response = await this.client.get(`/topics/student/${studentId}`);
    return response.data.data;
  }

  async getTopicsBySupervisor(supervisorId: string): Promise<Topic[]> {
    const response = await this.client.get(`/topics/supervisor/${supervisorId}`);
    return response.data.data;
  }

  async getTopicsByStatus(status: string): Promise<Topic[]> {
    const response = await this.client.get(`/topics/status/${status}`);
    return response.data.data;
  }

  async getTopicsByField(field: string): Promise<Topic[]> {
    const response = await this.client.get(`/topics/field/${field}`);
    return response.data.data;
  }

  // ==================== BLOCKCHAIN EXPLORER OPERATIONS ====================

  async getBlockchainInfo(): Promise<any> {
    const response = await this.client.get('/topics/fabric/blockchain-info');
    return response.data.data;
  }

  async getAllBlocks(): Promise<any[]> {
    const response = await this.client.get('/topics/fabric/blocks');
    return response.data.data;
  }

  async getBlockByNumber(blockNumber: number): Promise<any> {
    const response = await this.client.get(`/topics/fabric/blocks/${blockNumber}`);
    return response.data.data;
  }

  async getAllTransactions(): Promise<any[]> {
    const response = await this.client.get('/topics/fabric/transactions');
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
