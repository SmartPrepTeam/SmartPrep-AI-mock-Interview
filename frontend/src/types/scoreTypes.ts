export type textScoreData = {
  Tone: number;
  Accuracy: number;
  Clarity: number;
  Grammar: number;
  Feedback: string;
};

export type videoScoreData = {
  llm_response: textScoreData;
  video_confidence: number[];
};
