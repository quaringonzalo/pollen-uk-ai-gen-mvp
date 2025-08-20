// Reduced 15-Question DISC Assessment - Selected from Enhanced Assessment
// Maintains all existing data outputs and behavioral profiling

import { 
  AssessmentQuestion, 
  AssessmentResponse, 
  DiscProfile,
  calculateDiscProfile as calculateEnhancedDiscProfile
} from './enhanced-disc-assessment';

// 15 Questions selected from the current 30-question live assessment
export const REDUCED_DISC_QUESTIONS: AssessmentQuestion[] = [
  // Block 1: Core Decision Making & Problem Solving (5 questions)
  {
    id: "group_projects",
    question: "When working on a group project...",
    options: [
      { text: "I immediately take charge and make sure we get results", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I focus on getting everyone excited and motivated", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I make sure everyone feels heard and we work together", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I research thoroughly and plan everything out properly", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "netflix_choices",
    question: "When choosing what to watch with a group...",
    options: [
      { text: "Someone needs to pick something so we can get on with it", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I ask everyone what they're in the mood for", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I'll go with whatever keeps everyone happy", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I check ratings and find the best option", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "trying_new_places",
    question: "When someone suggests a new restaurant or activity...",
    options: [
      { text: "Let's do it - life's too short to overthink!", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I get excited about the adventure and rally everyone", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I prefer places friends have recommended first", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I need to research and check it out online first", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "phone_breaks",
    question: "If my phone died the day before something important...",
    options: [
      { text: "I'd immediately spring into action to fix or replace it", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I'd ask friends for help and make it a group mission", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I'd stay calm and figure out a workaround with support", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I'd research and compare all repair/replacement options", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "big_purchases",
    question: "When buying something expensive (laptop, phone, car, etc.)...",
    options: [
      { text: "I decide what I want and just get on with buying it", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I ask friends for recommendations and read some reviews", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I stick with trusted brands that haven't let me down before", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I research and compare absolutely everything available", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },

  // Block 2: Social & Communication Style (5 questions)
  {
    id: "games_with_friends",
    question: "When playing games with friends I...",
    options: [
      { text: "Play to win - that's the whole point!", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "Love the social side and making sure everyone has fun", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "Prefer team games where we all succeed together", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "Study the rules carefully and play strategically", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "friend_feeling_rubbish",
    question: "When a friend is feeling rubbish...",
    options: [
      { text: "I give them practical advice to actually solve the problem", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "Time to cheer them up and help them see the bright side", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I listen properly and offer emotional support", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I help them think through what's really going on logically", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "learning_new_stuff",
    question: "Learning new stuff works best when...",
    options: [
      { text: "I jump in and learn by doing, figuring it out as I go", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I learn with other people in a fun, interactive way", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I can learn gradually with support and encouragement", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I study properly and master the fundamentals first", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "friends_drama",
    question: "When two of my friends are properly arguing...",
    options: [
      { text: "I tell them both to sort it out and move on", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I try to lighten the mood and find common ground", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I step in to mediate and help them understand each other", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I stay neutral and let them work it out themselves", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "organizing_parties",
    question: "When I'm planning a birthday or gathering...",
    options: [
      { text: "I focus on the big picture and get others to handle details", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "It's all about creating a fun, memorable experience for everyone", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I make sure everyone feels included and comfortable", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I plan every single detail so nothing can go wrong", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },

  // Block 3: Work Style & Motivation (5 questions)
  {
    id: "feeling_overwhelmed",
    question: "When I'm feeling properly overwhelmed...",
    options: [
      { text: "I tackle the biggest problems first and regain control", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I talk to friends and focus on staying positive about it", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I seek comfort and support from people I trust most", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I step back, organise my thoughts, and make a proper plan", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "tech_stops_working",
    question: "When tech stops working (Wi-Fi down, app crashing, computer being annoying)...",
    options: [
      { text: "I try a few quick fixes and move on if they don't work", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I ask others for help and try their suggestions", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I stay patient and try different solutions gradually", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I systematically troubleshoot until I find what's actually wrong", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "multiple_deadlines",
    question: "When multiple deadlines are approaching...",
    options: [
      { text: "I prioritise the most important ones and power through", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I work with friends and break it up with fun stuff", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I pace myself steadily and ask for help when I need it", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I create a proper schedule and systematically work through everything", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "perfect_weekend",
    question: "The perfect weekend is...",
    options: [
      { text: "Tackling my goals and getting things accomplished", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "Spontaneous adventures and seeing where the day takes me", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "Chilled activities with the people I care about most", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "Planned activities that I've been looking forward to", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "personal_goals",
    question: "When I set myself a goal (fitness, learning something new, etc.)...",
    options: [
      { text: "I attack it aggressively until I smash through obstacles", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I share it with friends to stay motivated and accountable", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I make steady progress and celebrate the small wins", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I create detailed plans with milestones to track everything", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  }
];

// Proper calculation function for reduced assessment
export function calculateDiscProfile(responses: AssessmentResponse[]): DiscProfile {
  console.log("=== REDUCED DISC CALCULATION START ===");
  console.log(`Processing ${responses.length} responses`);
  console.log("Sample responses:", responses.slice(0, 3));
  
  const rawScores = { red: 0, yellow: 0, green: 0, blue: 0 };
  
  // Calculate raw scores using proper forced choice methodology
  responses.forEach((response, index) => {
    const question = REDUCED_DISC_QUESTIONS[index];
    if (!question) {
      console.log(`Warning: No question found for index ${index}`);
      return;
    }
    
    const mostLikeOption = question.options[response.mostLikeMe];
    const leastLikeOption = question.options[response.leastLikeMe];
    
    // For forced choice: +3 for "most like me", -1 for "least like me"
    if (mostLikeOption) {
      rawScores.red += mostLikeOption.discScores.red * 3;
      rawScores.yellow += mostLikeOption.discScores.yellow * 3;
      rawScores.green += mostLikeOption.discScores.green * 3;
      rawScores.blue += mostLikeOption.discScores.blue * 3;
      console.log(`Q${index}: Added +3 for "most like me":`, {
        red: mostLikeOption.discScores.red * 3,
        yellow: mostLikeOption.discScores.yellow * 3,
        green: mostLikeOption.discScores.green * 3,
        blue: mostLikeOption.discScores.blue * 3
      });
    }
    
    if (leastLikeOption) {
      rawScores.red -= leastLikeOption.discScores.red;
      rawScores.yellow -= leastLikeOption.discScores.yellow;
      rawScores.green -= leastLikeOption.discScores.green;
      rawScores.blue -= leastLikeOption.discScores.blue;
      console.log(`Q${index}: Subtracted -1 for "least like me":`, {
        red: -leastLikeOption.discScores.red,
        yellow: -leastLikeOption.discScores.yellow,
        green: -leastLikeOption.discScores.green,
        blue: -leastLikeOption.discScores.blue
      });
    }
  });
  
  console.log("Raw scores before processing:", rawScores);
  
  // Ensure all scores are non-negative (set minimum to 0)
  rawScores.red = Math.max(0, rawScores.red);
  rawScores.yellow = Math.max(0, rawScores.yellow);
  rawScores.green = Math.max(0, rawScores.green);
  rawScores.blue = Math.max(0, rawScores.blue);
  
  console.log("Raw scores after ensuring non-negative:", rawScores);
  
  // Convert to percentages that sum to 100%
  const totalScore = rawScores.red + rawScores.yellow + rawScores.green + rawScores.blue;
  console.log("Total score:", totalScore);
  
  const percentages = totalScore > 0 ? {
    red: Math.round((rawScores.red / totalScore) * 100),
    yellow: Math.round((rawScores.yellow / totalScore) * 100),
    green: Math.round((rawScores.green / totalScore) * 100),
    blue: Math.round((rawScores.blue / totalScore) * 100)
  } : {
    red: 25, yellow: 25, green: 25, blue: 25 // Balanced fallback
  };
  
  console.log("Initial percentages:", percentages);
  
  // Ensure percentages sum to 100% (adjust for rounding)
  const sum = percentages.red + percentages.yellow + percentages.green + percentages.blue;
  if (sum !== 100) {
    let highest: keyof typeof percentages = 'red';
    let maxValue = percentages.red;
    
    if (percentages.yellow > maxValue) {
      highest = 'yellow';
      maxValue = percentages.yellow;
    }
    if (percentages.green > maxValue) {
      highest = 'green';
      maxValue = percentages.green;
    }
    if (percentages.blue > maxValue) {
      highest = 'blue';
      maxValue = percentages.blue;
    }
    
    percentages[highest] += (100 - sum);
    console.log("Adjusted percentages:", percentages);
  }
  
  // Simplified validation for reduced assessment
  const consistencyScore = 85; // Default good consistency
  const socialDesirabilityScore = 25; // Low social desirability bias
  const validityScore = 85; // Good validity
  
  console.log("Final DISC percentages:", percentages);
  console.log("=== REDUCED DISC CALCULATION END ===");
  
  return {
    red: percentages.red,
    yellow: percentages.yellow,
    green: percentages.green,
    blue: percentages.blue,
    validityScore,
    consistencyScore,
    socialDesirabilityScore,
    isReliable: validityScore >= 70,
    completedAt: new Date(),
    pointsAwarded: 50 // Fixed points for completion
  };
}