# AI Prompt Engineering Log

## Feature: AI Interview Prep Coach

This feature provides users with likely interview questions and an actionable tip based on the job role and company they are applying to.

### Prompt Iteration 1

**Prompt:**
```text
Given the role "{role}" at "{company}", provide 3 interview questions and a tip.
```

**Input:** 
Role: "Frontend Engineer", Company: "Stripe"

**Output:**
```text
1. Tell me about a time you solved a complex UI issue.
2. How do you handle state management?
3. Why do you want to work at Stripe?
Tip: Be sure to talk about their payment APIs.
```

**Critique:** 
The output was too generic and unstructured, making it very difficult for our backend to parse and send to the frontend UI predictably. We need structured JSON.

---

### Prompt Iteration 2

**Prompt:**
```text
Generate 3 interview questions and 1 tip for the role of "{role}" at "{company}". Format the response in JSON like this:
{ "questions": ["..."], "tip": "..." }
```

**Input:** 
Role: "Frontend Engineer", Company: "Stripe"

**Output:**
```text
```json
{
  "questions": [
    "How would you architect the frontend for a new Stripe Dashboard feature?",
    "Explain how you would optimize a React application that processes real-time payment events.",
    "Describe a challenging bug you faced and how you debugged it."
  ],
  "tip": "Stripe values clarity and user-centric design; highlight how your technical decisions improve the end-user experience."
}
```
```

**Critique:** 
This was much better. The questions became highly specific to the company and the output was in JSON. However, the model included markdown code blocks (` ```json `), which caused `JSON.parse()` on our backend to throw an error. We either need to clean the text in code, or instruct the model not to use markdown.

---

### Prompt Iteration 3 (Final Choice)

**Prompt:**
```text
You are an expert tech recruiter and career coach. 
Given the role "{role}" at "{company}", provide exactly 3 likely interview questions a candidate might face, and 1 brief, actionable tip on how to stand out.
Return the result strictly as a valid JSON object (without markdown wrappers or code blocks) with this exact schema:
{
  "questions": ["Question 1", "Question 2", "Question 3"],
  "tip": "Your actionable tip here"
}
```

**Input:** 
Role: "Frontend Engineer", Company: "Stripe"

**Output:**
```json
{
  "questions": [
    "How would you architect the frontend for a new Stripe Dashboard feature ensuring robust error handling?",
    "Explain how you would optimize a React application that processes real-time payment webhook events.",
    "Describe a challenging bug you faced related to cross-browser compatibility and how you debugged it."
  ],
  "tip": "Stripe values clarity, security, and user-centric design; explicitly highlight how your technical decisions prioritize end-user safety and experience."
}
```

**Why this worked best:**
Adding a persona ("expert tech recruiter") improved the quality and tone of the output. Strictly specifying the JSON schema and explicitly telling the model to avoid markdown wrappers ensured that our backend could consistently parse the output using `JSON.parse()` without crashing. This prompt is robust and provides high-value content to the user.
