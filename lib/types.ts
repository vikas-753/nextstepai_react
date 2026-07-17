import { z } from "zod"

// ---------- User profile collected before the questionnaire ----------
export const profileSchema = z.object({
  fullName: z.string().min(1, "Please enter your name"),
  educationLevel: z.string().min(1, "Please select your education level"),
  fieldOrStream: z.string().min(1, "Please tell us your field or stream"),
  location: z.string().min(1, "Please enter your location"),
  goals: z.string().optional().default(""),
})

export type Profile = z.infer<typeof profileSchema>

// ---------- AI-generated questionnaire ----------
export const questionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  helpText: z.string().optional(),
  type: z.enum(["single", "multi", "scale", "text"]),
  options: z.array(z.string()).optional(),
})

export type Question = z.infer<typeof questionSchema>

export const questionListSchema = z.object({
  questions: z.array(questionSchema).min(15).max(30),
})

// An answer maps a question id to the user's response(s)
export type AnswerValue = string | string[] | number
export type Answers = Record<string, AnswerValue>

// ---------- AI-generated career report ----------
export const careerMatchSchema = z.object({
  title: z.string(),
  matchScore: z.number().min(0).max(100),
  summary: z.string(),
  whyItFits: z.array(z.string()),
  keySkills: z.array(z.string()),
  typicalRoles: z.array(z.string()),
  salaryOutlook: z.string(),
  growthOutlook: z.string(),
})

export const roadmapStepSchema = z.object({
  phase: z.string(),
  timeframe: z.string(),
  actions: z.array(z.string()),
})

export const businessIdeaSchema = z.object({
  name: z.string(),
  description: z.string(),
  startupSteps: z.array(z.string()),
})

export const learningResourceSchema = z.object({
  name: z.string(),
  type: z.string(),
  focus: z.string(),
})

export const reportSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  topCareerMatches: z.array(careerMatchSchema).min(3).max(6),
  roadmap: z.array(roadmapStepSchema),
  skillsToBuild: z.array(z.string()),
  recommendedLearning: z.array(learningResourceSchema),
  businessIdeas: z.array(businessIdeaSchema),
  governmentAndScholarshipOptions: z.array(z.string()),
  encouragement: z.string(),
})

export type CareerReport = z.infer<typeof reportSchema>
