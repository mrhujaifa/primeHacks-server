export interface ICreateSubmissionPayload {
  title: string;
  shortSummary: string;
  description: string;
  techStack: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface IUpdateSubmissionPayload {
  title?: string;
  shortSummary?: string;
  description?: string;
  techStack?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}
