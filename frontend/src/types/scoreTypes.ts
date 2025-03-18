export type textScoreData = {
  Tone: number;
  Accuracy: number;
  Clarity: number;
  Grammar: number;
  Feedback: string;
};

export type videoScoreData = {
  llm_scores: textScoreData;
  video_confidence: number[];
};
