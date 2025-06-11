import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import agentRoutes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Unhandled error:", error);

  const response = {
    success: false,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  };

  res.status(500).json(response);
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/agents", agentRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
