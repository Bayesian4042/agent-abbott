export const personalAssistantPlanPrompt = (variables: { objective: string, agents: string }) => `
You are tasked with orchestrating a plan to execute a personal assistant command.

Objective: ${variables.objective}

You have access to the following Agents:
${variables.agents}

Generate a plan with the following sequential steps:
1. Parse the command to identify required actions
2. For calendar events: Create event in Google Calendar (GoogleCalendarAgent)
3. For tasks: Create task in Google Tasks (GoogleTasksAgent)
4. For visual confirmation: Take screenshot of the result (ScreenshotAgent)

Return your response in the following JSON structure:
    {
        "steps": [
            {
                "objective": "Objective for this step 1",
                "tasks": [
                    {
                        "description": "Description of task 1",
                        "agent": "agent_name"
                    },
                    {
                        "description": "Description of task 2", 
                        "agent": "agent_name2"
                    }
                ]
            }
        ],
        "isComplete": false
    }
`;
