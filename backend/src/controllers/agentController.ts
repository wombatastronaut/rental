import { Request, Response } from "express";
import { AgentService } from "../services/agentService";
import { ValidationError } from "../utils/validation";
import { ApiResponse } from "../types/agent";

export class AgentController {
  private agentService: AgentService;

  constructor() {
    this.agentService = new AgentService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const agent = this.agentService.create(req.body);
      const response: ApiResponse<any> = {
        success: true,
        data: agent,
        message: "Agent created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search } = req.query;
      let agents;

      if (search && typeof search === "string") {
        agents = this.agentService.search(search);
      } else {
        agents = this.agentService.getAll();
      }

      const response: ApiResponse<any> = {
        success: true,
        data: agents,
        message: `Retrieved ${agents.length} agent(s)`,
      };
      res.json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const agent = this.agentService.getById(id);

      if (!agent) {
        const response: ApiResponse<any> = {
          success: false,
          error: "Agent not found",
          message: `No agent found with ID: ${id}`,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: agent,
        message: "Agent retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const agent = this.agentService.update(id, req.body);

      if (!agent) {
        const response: ApiResponse<any> = {
          success: false,
          error: "Agent not found",
          message: `No agent found with ID: ${id}`,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: agent,
        message: "Agent updated successfully",
      };
      res.json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = this.agentService.delete(id);

      if (!deleted) {
        const response: ApiResponse<any> = {
          success: false,
          error: "Agent not found",
          message: `No agent found with ID: ${id}`,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "Agent deleted successfully",
      };
      res.json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: any, res: Response): void {
    console.error("Error:", error);

    if (error instanceof ValidationError) {
      const response: ApiResponse<any> = {
        success: false,
        error: "Validation Error",
        message: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<any> = {
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    };
    res.status(500).json(response);
  }
}
