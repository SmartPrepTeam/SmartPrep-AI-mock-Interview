import {createSlice,PayloadAction} from '@reduxjs/toolkit'
export type Feedback ={
    Tone: number;
    Clarity: number;
    Accuracy: number;
    Grammar: number;
    Feedback: string;
  }
type HistoryInsightsState= {
    feedback: Feedback;
    answers: string[];
    questions: string[];
  }
const initialState:HistoryInsightsState={
    feedback:{
        Tone: 0,
        Clarity: 0,
        Accuracy: 0,
        Grammar: 0,
        Feedback:'',

    },
    answers:[],
    questions:[]
}
const InsightsSlice=createSlice({
    name:'historyAnalysis',
    initialState,
    reducers:{
        setQuestions:(state,action:PayloadAction<string[]>)=>{
            state.questions=action.payload
            console.log("setting questions",state.questions);
        },
        setAnswers:(state,action:PayloadAction<string[]>)=>{
            state.answers=action.payload
            console.log("setting answers",state.answers);
        },
        setFeedback:(state,action:PayloadAction<Feedback>)=>{
            state.feedback=action.payload
            console.log("setting feedback",state.feedback);
        },

    }

})

export const {setAnswers,setFeedback,setQuestions} = InsightsSlice.actions;
export default InsightsSlice.reducer
