import { v4 as uuidv4 } from "uuid";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "../types/agent";
import { validateAgent, ValidationError } from "../utils/validation";

export class AgentService {
  private agents: Agent[] = [];

  create(agentData: CreateAgentRequest): Agent {
    validateAgent(agentData);

    if (
      this.agents.some(
        (agent) => agent.email.toLowerCase() === agentData.email.toLowerCase()
      )
    ) {
      throw new ValidationError(
        "Email already exists. Please use a different email address."
      );
    }

    const newAgent: Agent = {
      id: uuidv4(),
      firstName: agentData.firstName.trim(),
      lastName: agentData.lastName.trim(),
      email: agentData.email.toLowerCase().trim(),
      mobileNumber: agentData.mobileNumber.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.push(newAgent);
    return newAgent;
  }

  getAll(): Agent[] {
    return [...this.agents];
  }

  getById(id: string): Agent | null {
    return this.agents.find((agent) => agent.id === id) || null;
  }

  update(
    id: string,
    updateData: UpdateAgentRequest
  ): Agent | null {
    const agentIndex = this.agents.findIndex((agent) => agent.id === id);

    if (agentIndex === -1) {
      return null;
    }

    validateAgent(updateData, true);
    if (updateData.email) {
      const emailExists = this.agents.some(
        (agent) =>
          agent.id !== id &&
          agent.email.toLowerCase() === updateData.email!.toLowerCase()
      );
      if (emailExists) {
        throw new ValidationError(
          "Email already exists. Please use a different email address."
        );
      }
    }

    const currentAgent = this.agents[agentIndex];
    const updatedAgent: Agent = {
      ...currentAgent,
      ...(updateData.firstName && { firstName: updateData.firstName.trim() }),
      ...(updateData.lastName && { lastName: updateData.lastName.trim() }),
      ...(updateData.email && { email: updateData.email.toLowerCase().trim() }),
      ...(updateData.mobileNumber && {
        mobileNumber: updateData.mobileNumber.trim(),
      }),
      updatedAt: new Date(),
    };

    this.agents[agentIndex] = updatedAgent;
    return updatedAgent;
  }

  delete(id: string): boolean {
    const initialLength = this.agents.length;
    this.agents = this.agents.filter((agent) => agent.id !== id);
    return this.agents.length < initialLength;
  }

  search(query: string): Agent[] {
    const searchTerm = query.toLowerCase();
    return this.agents.filter(
      (agent) =>
        agent.firstName.toLowerCase().includes(searchTerm) ||
        agent.lastName.toLowerCase().includes(searchTerm) ||
        agent.email.toLowerCase().includes(searchTerm) ||
        agent.mobileNumber.includes(searchTerm)
    );
  }
}
