import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

export const NOTION_JOBS_BOARD_ID = process.env.NOTION_PAGE_URL ? 
    extractPageIdFromUrl(process.env.NOTION_PAGE_URL) : null;

/**
 * Create a standardized job posting on Notion jobs board
 */
export async function createJobPosting(jobData: {
    title: string;
    description: string;
    location: string;
    isRemote: boolean;
    salaryMin?: string;
    salaryMax?: string;
    requiredSkills: string[];
    preferredSkills: string[];
    employerId: number;
    challengeRequired: boolean;
}) {
    if (!NOTION_JOBS_BOARD_ID) {
        throw new Error("Notion jobs board URL not configured");
    }

    // Standardize job description to be entry-level friendly
    const standardizedDescription = standardizeJobDescription(jobData.description);

    try {
        const response = await notion.pages.create({
            parent: {
                type: "page_id",
                page_id: NOTION_JOBS_BOARD_ID
            },
            properties: {
                "Job Title": {
                    title: [
                        {
                            text: {
                                content: jobData.title
                            }
                        }
                    ]
                },
                "Location": {
                    rich_text: [
                        {
                            text: {
                                content: `${jobData.location}${jobData.isRemote ? ' (Remote)' : ''}`
                            }
                        }
                    ]
                },
                "Salary Range": {
                    rich_text: [
                        {
                            text: {
                                content: jobData.salaryMin && jobData.salaryMax 
                                    ? `£${jobData.salaryMin} - £${jobData.salaryMax}`
                                    : 'Competitive'
                            }
                        }
                    ]
                },
                "Required Skills": {
                    multi_select: jobData.requiredSkills.map(skill => ({ name: skill }))
                },
                "Status": {
                    select: {
                        name: "Active"
                    }
                },
                "Challenge Required": {
                    checkbox: jobData.challengeRequired
                }
            },
            children: [
                {
                    object: "block",
                    type: "heading_2",
                    heading_2: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: "About This Role"
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: standardizedDescription
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: "What You'll Need"
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: `Skills: ${jobData.requiredSkills.join(', ')}`
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: "Positive attitude and willingness to learn"
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: "Strong communication and collaboration skills"
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: "How to Apply"
                                }
                            }
                        ]
                    }
                },
                {
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: jobData.challengeRequired 
                                        ? "Complete the skills challenge on the Pollen platform to apply for this role."
                                        : "Apply directly through the Pollen platform."
                                }
                            }
                        ]
                    }
                }
            ]
        });

        return response.id;
    } catch (error) {
        console.error("Error creating Notion job posting:", error);
        throw error;
    }
}

/**
 * Standardize job descriptions to be entry-level friendly and inclusive
 */
function standardizeJobDescription(originalDescription: string): string {
    let standardized = originalDescription;

    // Replace experience requirements with learning opportunities
    standardized = standardized.replace(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi, 
        'experience or strong willingness to learn');
    
    // Replace "senior" or "lead" with more inclusive terms
    standardized = standardized.replace(/\b(senior|lead|principal)\b/gi, 'developing');
    
    // Replace "expert" with "proficient" or "developing skills in"
    standardized = standardized.replace(/\bexpert\b/gi, 'developing skills in');
    
    // Add inclusive language
    const inclusiveClosing = "\n\nWe welcome applications from all backgrounds and experience levels. " +
        "If you're passionate about this role and eager to learn, we'd love to hear from you!";
    
    if (!standardized.includes("welcome applications")) {
        standardized += inclusiveClosing;
    }

    return standardized;
}

/**
 * Update job posting status on Notion
 */
export async function updateJobStatus(notionPageId: string, status: 'Active' | 'Closed' | 'On Hold') {
    try {
        await notion.pages.update({
            page_id: notionPageId,
            properties: {
                "Status": {
                    select: {
                        name: status
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error updating Notion job status:", error);
        throw error;
    }
}

/**
 * Get job applications from Notion (if tracking applications there)
 */
export async function getJobApplications(notionPageId: string) {
    try {
        // This would depend on your Notion database structure for applications
        // For now, return empty array
        return [];
    } catch (error) {
        console.error("Error fetching job applications from Notion:", error);
        return [];
    }
}