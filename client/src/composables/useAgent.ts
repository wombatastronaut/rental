import { ref, computed } from 'vue';
import { apiService } from '../services/api';
import { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/agent';

export function useAgent() {
  const agents = ref<Agent[]>([]);
  const currentAgent = ref<Agent | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isLoading = computed(() => loading.value);
  const hasError = computed(() => !!error.value);
  const errorMessage = computed(() => error.value);

  const clearError = () => {
    error.value = null;
  };

  const setError = (message: string) => {
    error.value = message;
  };

  const clearCurrentAgent = () => {
    currentAgent.value = null;
  }

  const fetchAgents = async (search?: string) => {
    loading.value = true;
    clearError();
    
    try {
      agents.value = await apiService.getAgents(search);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agents');
    } finally {
      loading.value = false;
    }
  };

  const fetchAgent = async (id: string) => {
    loading.value = true;
    clearError();
    
    try {
      currentAgent.value = await apiService.getAgent(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agent');
    } finally {
      loading.value = false;
    }
  };

  const createAgent = async (agentData: CreateAgentRequest) => {
    loading.value = true;
    clearError();
    
    try {
      const newAgent = await apiService.createAgent(agentData);
      agents.value.push(newAgent);
      return newAgent;
    } catch (err: any) {
      setError(err.message || 'Failed to create agent');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAgent = async (id: string, agentData: UpdateAgentRequest) => {
    loading.value = true;
    clearError();
    
    try {
      const updatedAgent = await apiService.updateAgent(id, agentData);
      const index = agents.value.findIndex(agent => agent.id === id);
      if (index !== -1) {
        agents.value[index] = updatedAgent;
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = updatedAgent;
      }
      return updatedAgent;
    } catch (err: any) {
      setError(err.message || 'Failed to update agent');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteAgent = async (id: string) => {
    loading.value = true;
    clearError();
    
    try {
      await apiService.deleteAgent(id);
      agents.value = agents.value.filter(agent => agent.id !== id);
      if (currentAgent.value?.id === id) {
        currentAgent.value = null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete agent');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    agents,
    currentAgent,
    clearCurrentAgent,
    isLoading,
    hasError,
    errorMessage,
    clearError,
    fetchAgents,
    fetchAgent,
    createAgent,
    updateAgent,
    deleteAgent
  };
}