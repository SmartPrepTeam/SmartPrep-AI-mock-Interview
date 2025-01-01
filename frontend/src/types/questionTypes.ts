export interface Question {
  question: string;
  type: string;
}

export interface QuestionPageContentProps {
  questions: Question[];
  user_id: string;
  question_id: string;
}
