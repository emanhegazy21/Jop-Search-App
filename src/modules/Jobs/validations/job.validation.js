import Joi from "joi";


export const createJobSchema = Joi.object({
  jobTitle: Joi.string().trim().required(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
  workingTime: Joi.string().valid("part-time", "full-time").required(),
  seniorityLevel: Joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
  jobDescription: Joi.string().required(),
  technicalSkills: Joi.array().items(Joi.string()).min(1).required(),
  softSkills: Joi.array().items(Joi.string()).min(1).required(),
  companyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});


export const updateJobSchema = Joi.object({
  jobTitle: Joi.string().trim(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime: Joi.string().valid("part-time", "full-time"),
  seniorityLevel: Joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
  jobDescription: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
  closed: Joi.boolean()
}).min(1); 