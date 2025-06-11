export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return mobileRegex.test(mobile.replace(/[\s\-\(\)]/g, ""));
};

export const validateAgent = (agent: any, isUpdate = false): void => {
  if (!isUpdate) {
    if (
      !agent.firstName ||
      typeof agent.firstName !== "string" ||
      agent.firstName.trim().length === 0
    ) {
      throw new ValidationError(
        "First name is required"
      );
    }

    if (
      !agent.lastName ||
      typeof agent.lastName !== "string" ||
      agent.lastName.trim().length === 0
    ) {
      throw new ValidationError(
        "Last name is required"
      );
    }

    if (!agent.email || typeof agent.email !== "string") {
      throw new ValidationError("Email is required");
    }

    if (!agent.mobileNumber || typeof agent.mobileNumber !== "string") {
      throw new ValidationError("Mobile number is required");
    }
  }

  if (agent.email && !validateEmail(agent.email)) {
    throw new ValidationError("Invalid email format");
  }

  if (agent.mobileNumber && !validateMobileNumber(agent.mobileNumber)) {
    throw new ValidationError("Invalid mobile number format");
  }

  if (
    agent.firstName &&
    (typeof agent.firstName !== "string" || agent.firstName.trim().length === 0)
  ) {
    throw new ValidationError("First name is required");
  }

  if (
    agent.lastName &&
    (typeof agent.lastName !== "string" || agent.lastName.trim().length === 0)
  ) {
    throw new ValidationError("Last name is required");
  }
};
