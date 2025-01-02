export interface Question {
  question: string;
  type: string;
}

export interface QuestionPageContentProps {
  questions: Question[];
  question_id: string;
}
