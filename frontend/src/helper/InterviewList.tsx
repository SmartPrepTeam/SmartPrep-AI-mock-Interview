export type Interview ={
    jobTitle: string;
    difficultyLevel: "easy" | "medium" | "hard";
    status: "incomplete" | "complete";
    createdAt: string; 
    objectId: string;
    type: "video" | "textual";
    score: number;
    duration: "short" | "medium" | "long";
}
export   const Interviews :Interview[]= [
    {
        jobTitle: "Full Stack Developer",
        difficultyLevel: "hard",
        status: "incomplete",
        createdAt: "2024-12-10T08:00:00Z",
        objectId: "4u5v6w7x8y",
        type: "video",
        score: 5,
        duration: "medium"
    },
    {
        jobTitle: "Product Manager",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-12-05T14:20:00Z",
        objectId: "3k4l5m6n7o",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Backend Developer",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-11-02T13:15:00Z",
        objectId: "5a6b7c8d9f",
        type: "textual",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "Database Administrator",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-11-04T09:10:00Z",
        objectId: "4w5x6y7z8a",
        type: "textual",
        score: 9,
        duration: "long"
    },
    {
        jobTitle: "Business Analyst",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-11-09T12:35:00Z",
        objectId: "2w3x4y5z6a",
        type: "video",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "Network Engineer",
        difficultyLevel: "easy",
        status: "complete",
        createdAt: "2024-10-07T08:30:00Z",
        objectId: "0l1m2n3o4p",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Technical Support Specialist",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-10-08T07:00:00Z",
        objectId: "0w1u2v3w4x",
        type: "video",
        score: 4,
        duration: "short"
    },
    {
        jobTitle: "Software Engineer",
        difficultyLevel: "medium",
        status: "incomplete",
        createdAt: "2024-10-01T10:00:00Z",
        objectId: "1m2b3c4d5e",
        type: "video",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "DevOps Engineer",
        difficultyLevel: "hard",
        status: "incomplete",
        createdAt: "2024-09-01T15:00:00Z",
        objectId: "2j3c4d5e6f",
        type: "video",
        score: 3,
        duration: "short"
    },
    {
        jobTitle: "Frontend Developer",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-08-03T11:30:00Z",
        objectId: "7h8i9j0k1l",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Cloud Architect",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-08-30T17:50:00Z",
        objectId: "1g2h3i4j5k",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "Product Designer",
        difficultyLevel: "easy",
        status: "complete",
        createdAt: "2024-06-29T13:40:00Z",
        objectId: "5b6c7d8e9f",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "Cybersecurity Analyst",
        difficultyLevel: "hard",
        status: "complete",
        createdAt: "2024-06-23T14:00:00Z",
        objectId: "7r8s9t0u1v",
        type: "textual",
        score: 9,
        duration: "long"
    },
    {
        jobTitle: "UI/UX Designer",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-06-25T11:45:00Z",
        objectId: "8p9q0r1s2t",
        type: "textual",
        score: 9,
        duration: "long"
    },
    {
        jobTitle: "Research Scientist",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-06-18T09:55:00Z",
        objectId: "1n2o3p4q5r",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "Data Scientist",
        difficultyLevel: "hard",
        status: "complete",
        createdAt: "2024-06-15T09:30:00Z",
        objectId: "6f7g8h9i0j",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "AI Researcher",
        difficultyLevel: "hard",
        status: "incomplete",
        createdAt: "2024-06-28T10:25:00Z",
        objectId: "9r0s1t2u3v",
        type: "video",
        score: 4,
        duration: "short"
    },
    {
        jobTitle: "Full Stack Developer",
        difficultyLevel: "hard",
        status: "incomplete",
        createdAt: "2024-06-15T08:00:00Z",
        objectId: "4j5v6w7x8y",
        type: "video",
        score: 5,
        duration: "medium"
    },
    {
        jobTitle: "Product Manager",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-03-12T14:20:00Z",
        objectId: "3f4l5m6n7o",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Backend Developer",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-03-03T13:15:00Z",
        objectId: "5a1b7c8d9f",
        type: "textual",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "Database Administrator",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-03-06T09:10:00Z",
        objectId: "4e5x6y7z8a",
        type: "textual",
        score: 9,
        duration: "long"
    },
    {
        jobTitle: "Cloud Architect",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-03-23T17:50:00Z",
        objectId: "192h3i4j5k",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "Business Analyst",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-03-28T12:35:00Z",
        objectId: "2x3x4y5z6a",
        type: "video",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "Network Engineer",
        difficultyLevel: "easy",
        status: "complete",
        createdAt: "2024-02-22T08:30:00Z",
        objectId: "0v1m2n3o4p",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Technical Support Specialist",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-02-25T07:00:00Z",
        objectId: "0t1u2v3w4x",
        type: "video",
        score: 4,
        duration: "short"
    },
    {
        jobTitle: "Software Engineer",
        difficultyLevel: "medium",
        status: "incomplete",
        createdAt: "2024-01-30T10:00:00Z",
        objectId: "1a2b3c4d5e",
        type: "video",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "DevOps Engineer",
        difficultyLevel: "hard",
        status: "incomplete",
        createdAt: "2024-01-25T15:00:00Z",
        objectId: "2b3c4d5e6f",
        type: "video",
        score: 4,
        duration: "short"
    },
    {
        jobTitle: "Frontend Developer",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-01-15T11:30:00Z",
        objectId: "7o8i9j0k1l",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Cloud Architect",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-01-03T17:50:00Z",
        objectId: "1e2h3i4j5k",
        type: "textual",
        score: 8,
        duration: "long"
    },
    {
        jobTitle: "Product Manager",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-01-10T14:20:00Z",
        objectId: "3a4l5m6n7o",
        type: "video",
        score: 6,
        duration: "medium"
    },
    {
        jobTitle: "Backend Developer",
        difficultyLevel: "medium",
        status: "complete",
        createdAt: "2024-01-12T13:15:00Z",
        objectId: "5f6b7c8d9f",
        type: "textual",
        score: 7,
        duration: "medium"
    },
    {
        jobTitle: "Database Administrator",
        difficultyLevel: "easy",
        status: "incomplete",
        createdAt: "2024-01-18T09:10:00Z",
        objectId: "4k5x6y7z8a",
        type: "textual",
        score: 9,
        duration: "long"
    }
];
