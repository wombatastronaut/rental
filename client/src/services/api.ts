import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  ApiResponse,
} from "../types/agent";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async createAgent(
    agentData: CreateAgentRequest
  ): Promise<Agent> {
    const response: AxiosResponse<ApiResponse<Agent>> =
      await this.api.post("/agents", agentData);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create agent");
    }
    return response.data.data!;
  }

  async getAgents(search?: string): Promise<Agent[]> {
    const params = search ? { search } : {};
    const response: AxiosResponse<ApiResponse<Agent[]>> =
      await this.api.get("/agents", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch agents");
    }
    return response.data.data!;
  }

  async getAgent(id: string): Promise<Agent> {
    const response: AxiosResponse<ApiResponse<Agent>> =
      await this.api.get(`/agents/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch agent");
    }
    return response.data.data!;
  }

  async updateAgent(
    id: string,
    agentData: UpdateAgentRequest
  ): Promise<Agent> {
    const response: AxiosResponse<ApiResponse<Agent>> =
      await this.api.put(`/agents/${id}`, agentData);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update agent");
    }
    return response.data.data!;
  }

  async deleteAgent(id: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(
      `/agents/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete agent");
    }
  }
}

export const apiService = new ApiService();
