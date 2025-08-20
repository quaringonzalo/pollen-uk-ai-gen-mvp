// Enhanced 28-Question DISC Assessment with Forced Choice Scoring
// Age-appropriate for 18-30 demographic, no work experience required

export interface DiscProfile {
  red: number;      // Dominance percentage
  yellow: number;   // Influence percentage  
  green: number;    // Steadiness percentage
  blue: number;     // Conscientiousness percentage
  validityScore: number;          // Overall assessment validity (0-100)
  consistencyScore: number;       // Response consistency (0-100)
  socialDesirabilityScore: number; // Social desirability bias (0-100)
  isReliable: boolean;            // Whether results are reliable for matching
  completedAt: Date;
  pointsAwarded: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  context?: string;
  options: {
    text: string;
    discScores: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
  }[];
}

export interface AssessmentResponse {
  questionId: string;
  mostLikeMe: number;  // Index of "most like me" option
  leastLikeMe: number; // Index of "least like me" option
}

// 28 Core Assessment Questions + 3 Validation Questions
export const ENHANCED_DISC_QUESTIONS: AssessmentQuestion[] = [
  // RED (Dominance) Questions 1-7
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
    id: "life_challenges",
    question: "When life gets challenging...",
    options: [
      { text: "I prefer to handle it myself and stay in control", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I talk it through with friends to get different perspectives", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I seek support from people I trust", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I step back and analyse the situation systematically", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
  },

  // YELLOW (Influence) Questions 8-14
  {
    id: "parties_unknown_people",
    question: "Parties where I don't know people are...",
    options: [
      { text: "Perfect for meeting the most interesting people there", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "Amazing! I love meeting new people and making connections", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "Better when I stick with people I know for deeper chats", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "Fine once I observe the vibe and find my comfort zone", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "explaining_to_friends",
    question: "When explaining something important to a friend...",
    options: [
      { text: "I get straight to the point with the key facts", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I tell stories and use examples to make it engaging", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I make sure they understand and feel comfortable asking questions", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I give them all the details so they have the full picture", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "social_media_vibe",
    question: "My social media vibe is...",
    options: [
      { text: "Sharing achievements and things that actually matter to me", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "All about sharing experiences and connecting with everyone", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "Meaningful moments shared with my close friends", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "Pretty private - I only share occasionally", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "smashed_something",
    question: "After doing something really well...",
    options: [
      { text: "I know I've succeeded - the results speak for themselves", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I love it when people notice and we can celebrate together", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I'm happiest when my close friends acknowledge the effort", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I feel satisfied knowing I've met my own high standards", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "great_ideas",
    question: "When I have a brilliant idea...",
    options: [
      { text: "I act on it quickly before someone else gets there first", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I share it with everyone immediately to get feedback and energy", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I discuss it with my trusted friends first", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I think it through completely before I tell anyone", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },

  // GREEN (Steadiness) Questions 15-21
  {
    id: "app_changes",
    question: "When my go-to app completely changes its interface...",
    options: [
      { text: "I adapt quickly and find new ways to get stuff done", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I get excited about exploring all the new features", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I need time to adjust but eventually get comfortable with it", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I preferred the old way and wish they'd kept it the same", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "ideal_social_circle",
    question: "My ideal social circle is...",
    options: [
      { text: "Ambitious people who challenge and inspire me to do better", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "A big, diverse group with loads of fun activities happening", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "A close-knit group of loyal, supportive friends", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "A few really meaningful friendships with shared interests", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "helping_others",
    question: "When someone needs my help...",
    options: [
      { text: "I give them direct advice on how to actually fix the problem", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I brainstorm ideas and help them get excited about solutions", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I provide emotional support and stick with them through it", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I help them analyse what's happening and consider all options", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "relationships",
    question: "In relationships (whether friends, romantic, or family)...",
    options: [
      { text: "I expect mutual respect and shared ambition to succeed", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I love variety and meeting new people regularly", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I value deep, long-term connections above everything else", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I prefer fewer relationships, but really compatible ones", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
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

  // BLUE (Conscientiousness) Questions 22-28
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
  {
    id: "preparing_important_stuff",
    question: "When getting ready for exams, presentations, or anything that matters...",
    options: [
      { text: "I focus on the key points that will actually get results", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I make it engaging and practice with friends", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I prepare steadily and ask for feedback along the way", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I study absolutely everything until I'm totally confident", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "space_organization",
    question: "My space organisation style is...",
    options: [
      { text: "Functional and efficient - I don't sweat the small stuff", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "It needs to look good and be comfortable when friends come over", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I keep things reasonably tidy but I'm not obsessive about it", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "Everything has its place and I actually keep it that way", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
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
    id: "complicated_explanations",
    question: "When someone explains something complicated...",
    options: [
      { text: "Just give me the bottom line - what do I actually need to do?", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I ask loads of questions and discuss it to make sure I get it", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I take time to process it and might ask them to repeat key bits", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I want all the details and need to understand how it actually works", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },

  // Validation Questions 29-31
  {
    id: "flatmate_issues_validation",
    question: "If your flatmates/roommates are having ongoing issues...",
    options: [
      { text: "I'd address it directly and set clear boundaries", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I'd organise a fun group activity to bring everyone together", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I'd try to mediate and help everyone get along", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I'd analyse the situation and suggest logical solutions", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "major_life_decisions_validation",
    question: "When facing a major life decision (career, relationships, etc.)...",
    options: [
      { text: "I trust my instincts and decide quickly", discScores: { red: 3, yellow: 0, green: 0, blue: 0 } },
      { text: "I talk it through with lots of different people", discScores: { red: 0, yellow: 3, green: 0, blue: 0 } },
      { text: "I take my time and seek advice from people I trust", discScores: { red: 0, yellow: 0, green: 3, blue: 0 } },
      { text: "I research thoroughly and weigh all pros and cons", discScores: { red: 0, yellow: 0, green: 0, blue: 3 } }
    ]
  }
];

// Validation question IDs for consistency checking
export const VALIDATION_PAIRS = [
  { original: "friends_drama", validation: "flatmate_issues_validation" },
  { original: "feeling_overwhelmed", validation: "major_life_decisions_validation" }
];

export const SOCIAL_DESIRABILITY_QUESTION = "frustration_frequency_detector";

export function calculateDiscProfile(responses: AssessmentResponse[]): DiscProfile {
  console.log("=== DISC CALCULATION START ===");
  console.log(`Processing ${responses.length} responses`);
  console.log("Sample responses:", responses.slice(0, 3));
  const rawScores = { red: 0, yellow: 0, green: 0, blue: 0 };
  
  // Calculate raw scores using forced choice methodology
  responses.forEach((response, index) => {
    const question = ENHANCED_DISC_QUESTIONS[index];
    if (!question) return;
    
    const mostLikeOption = question.options[response.mostLikeMe];
    const leastLikeOption = question.options[response.leastLikeMe];
    
    if (mostLikeOption) {
      rawScores.red += mostLikeOption.discScores.red;
      rawScores.yellow += mostLikeOption.discScores.yellow;
      rawScores.green += mostLikeOption.discScores.green;
      rawScores.blue += mostLikeOption.discScores.blue;
    }
    
    if (leastLikeOption) {
      rawScores.red -= leastLikeOption.discScores.red * 0.5;
      rawScores.yellow -= leastLikeOption.discScores.yellow * 0.5;
      rawScores.green -= leastLikeOption.discScores.green * 0.5;
      rawScores.blue -= leastLikeOption.discScores.blue * 0.5;
    }
  });
  
  // Normalize to positive values (minimum 0)
  const minScore = Math.min(rawScores.red, rawScores.yellow, rawScores.green, rawScores.blue);
  if (minScore < 0) {
    rawScores.red -= minScore;
    rawScores.yellow -= minScore;
    rawScores.green -= minScore;
    rawScores.blue -= minScore;
  }
  
  // Convert to percentages that sum to 100%
  const totalScore = rawScores.red + rawScores.yellow + rawScores.green + rawScores.blue;
  const percentages = totalScore > 0 ? {
    red: Math.round((rawScores.red / totalScore) * 100),
    yellow: Math.round((rawScores.yellow / totalScore) * 100),
    green: Math.round((rawScores.green / totalScore) * 100),
    blue: Math.round((rawScores.blue / totalScore) * 100)
  } : {
    red: 25, yellow: 25, green: 25, blue: 25 // Balanced fallback
  };
  
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
  }
  
  // Calculate validation scores
  const consistencyScore = calculateConsistencyScore(responses);
  const socialDesirabilityScore = calculateSocialDesirabilityScore(responses);
  const validityScore = calculateOverallValidityScore(consistencyScore, socialDesirabilityScore, responses);
  
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
    pointsAwarded: calculatePointsAwarded(validityScore)
  };
}

function calculateConsistencyScore(responses: AssessmentResponse[]): number {
  let consistencyScore = 100;
  
  VALIDATION_PAIRS.forEach(pair => {
    const originalIndex = ENHANCED_DISC_QUESTIONS.findIndex(q => q.id === pair.original);
    const validationIndex = ENHANCED_DISC_QUESTIONS.findIndex(q => q.id === pair.validation);
    
    if (originalIndex >= 0 && validationIndex >= 0) {
      const originalResponse = responses[originalIndex];
      const validationResponse = responses[validationIndex];
      
      if (originalResponse && validationResponse) {
        // Check if responses are logically consistent
        const originalMost = originalResponse.mostLikeMe;
        const validationMost = validationResponse.mostLikeMe;
        
        // Simple consistency check - same dimension preference
        const originalQuestion = ENHANCED_DISC_QUESTIONS[originalIndex];
        const validationQuestion = ENHANCED_DISC_QUESTIONS[validationIndex];
        
        const originalScores = originalQuestion.options[originalMost]?.discScores;
        const validationScores = validationQuestion.options[validationMost]?.discScores;
        
        if (originalScores && validationScores) {
          const originalHighest = getHighestDimension(originalScores);
          const validationHighest = getHighestDimension(validationScores);
          
          if (originalHighest !== validationHighest) {
            consistencyScore -= 20; // Penalize inconsistency
          }
        }
      }
    }
  });
  
  return Math.max(consistencyScore, 0);
}

function calculateSocialDesirabilityScore(responses: AssessmentResponse[]): number {
  const socialDesirabilityIndex = ENHANCED_DISC_QUESTIONS.findIndex(q => q.id === SOCIAL_DESIRABILITY_QUESTION);
  
  if (socialDesirabilityIndex >= 0) {
    const response = responses[socialDesirabilityIndex];
    if (response && response.mostLikeMe === 0) { // "Never" option
      return 100; // High social desirability bias
    }
  }
  
  return 20; // Low bias
}

function calculateOverallValidityScore(consistencyScore: number, socialDesirabilityScore: number, responses: AssessmentResponse[]): number {
  let validityScore = 100;
  
  // Penalize low consistency
  if (consistencyScore < 80) {
    validityScore -= (80 - consistencyScore);
  }
  
  // Penalize high social desirability
  if (socialDesirabilityScore > 50) {
    validityScore -= (socialDesirabilityScore - 50);
  }
  
  // Check for unusual response patterns
  const patternPenalty = checkResponsePatterns(responses);
  validityScore -= patternPenalty;
  
  return Math.max(validityScore, 0);
}

function checkResponsePatterns(responses: AssessmentResponse[]): number {
  let penalty = 0;
  
  // Check for alternating patterns
  let alternatingCount = 0;
  for (let i = 1; i < responses.length; i++) {
    if (responses[i].mostLikeMe !== responses[i-1].mostLikeMe) {
      alternatingCount++;
    }
  }
  
  if (alternatingCount / responses.length > 0.8) {
    penalty += 20; // Likely alternating pattern
  }
  
  // Check for same answer pattern
  const firstAnswer = responses[0]?.mostLikeMe;
  const sameAnswerCount = responses.filter(r => r.mostLikeMe === firstAnswer).length;
  
  if (sameAnswerCount / responses.length > 0.7) {
    penalty += 25; // Too many same answers
  }
  
  return penalty;
}

function getHighestDimension(scores: { red: number; yellow: number; green: number; blue: number }): string {
  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function calculatePointsAwarded(validityScore: number): number {
  if (validityScore >= 90) return 100;
  if (validityScore >= 80) return 75;
  if (validityScore >= 70) return 50;
  return 25;
}

export function generatePersonalizedEmoji(profile: DiscProfile): string {
  // Generate emoji based on dominant DISC profile
  const dimensions = [
    { name: 'red', value: profile.red },
    { name: 'yellow', value: profile.yellow },
    { name: 'green', value: profile.green },
    { name: 'blue', value: profile.blue }
  ];
  
  dimensions.sort((a, b) => b.value - a.value);
  const primary = dimensions[0];
  const secondary = dimensions[1];
  
  // Generate emoji based on primary and secondary combination
  if (primary.value >= 40) {
    // Strong primary profile
    switch (primary.name) {
      case 'red':
        if (secondary.name === 'yellow') return '🚀'; // Decisive Leader
        if (secondary.name === 'green') return '🎯'; // Results-Driven Collaborator
        if (secondary.name === 'blue') return '⚡'; // Strategic Director
        return '🔥'; // Action-Oriented Leader
      case 'yellow':
        if (secondary.name === 'red') return '🌟'; // Inspiring Motivator
        if (secondary.name === 'green') return '🤝'; // Supportive Communicator
        if (secondary.name === 'blue') return '💡'; // Thoughtful Influencer
        return '✨'; // Enthusiastic Connector
      case 'green':
        if (secondary.name === 'red') return '🛡️'; // Reliable Achiever
        if (secondary.name === 'yellow') return '🌱'; // Harmonious Team Player
        if (secondary.name === 'blue') return '🔧'; // Methodical Supporter
        return '🏠'; // Consistent Collaborator
      case 'blue':
        if (secondary.name === 'red') return '🎲'; // Systematic Problem-Solver
        if (secondary.name === 'yellow') return '📊'; // Analytical Communicator
        if (secondary.name === 'green') return '📋'; // Thoughtful Organiser
        return '🔍'; // Detail-Oriented Analyst
    }
  } else if (primary.value >= 30) {
    // Moderate primary profile
    switch (primary.name) {
      case 'red': return '💪';
      case 'yellow': return '🎉';
      case 'green': return '🤗';
      case 'blue': return '🧠';
    }
  } else {
    // Balanced profile
    if (primary.value - secondary.value <= 10) {
      return '⚖️'; // Balanced Adaptor
    }
    return '🌈'; // Versatile Professional
  }
  
  return '🔄'; // Adaptable Professional
}

export function generateDiscSummary(profile: DiscProfile): string {
  // Determine primary and secondary profiles
  const scores = [
    { name: "Dominant", value: profile.red, label: "D" },
    { name: "Influential", value: profile.yellow, label: "I" },  
    { name: "Steady", value: profile.green, label: "S" },
    { name: "Conscientious", value: profile.blue, label: "C" }
  ].sort((a, b) => b.value - a.value);

  const primary = scores[0];
  const secondary = scores[1];

  // Generate descriptive summary based on primary and secondary combinations
  if (primary.value >= 35) {
    // Strong primary profile
    switch (primary.name) {
      case "Dominant":
        if (secondary.name === "Influential") return "Decisive Leader";
        if (secondary.name === "Steady") return "Results-Driven Collaborator";
        if (secondary.name === "Conscientious") return "Strategic Director";
        return "Action-Oriented Leader";
      
      case "Influential":
        if (secondary.name === "Dominant") return "Inspiring Motivator";
        if (secondary.name === "Steady") return "Supportive Communicator";
        if (secondary.name === "Conscientious") return "Thoughtful Influencer";
        return "Enthusiastic Connector";
      
      case "Steady":
        if (secondary.name === "Dominant") return "Reliable Achiever";
        if (secondary.name === "Influential") return "Harmonious Team Player";
        if (secondary.name === "Conscientious") return "Methodical Supporter";
        return "Consistent Collaborator";
      
      case "Conscientious":
        if (secondary.name === "Dominant") return "Systematic Problem-Solver";
        if (secondary.name === "Influential") return "Analytical Communicator";
        if (secondary.name === "Steady") return "Thoughtful Organiser";
        return "Detail-Oriented Analyst";
    }
  } else {
    // Balanced profile
    if (primary.value - secondary.value <= 10) {
      return "Balanced Adaptor";
    }
    return "Versatile Professional";
  }
  
  return "Adaptable Professional";
}

export function generatePersonalityInsights(profile: DiscProfile): {
  strengths: string[];
  challenges: string[];
  idealWorkEnvironment: string[];
  motivators: string[];
  compatibleRoles: string[];
} {
  const insights = {
    strengths: [] as string[],
    challenges: [] as string[],
    idealWorkEnvironment: [] as string[],
    motivators: [] as string[],
    compatibleRoles: [] as string[]
  };
  
  // Generate insights based on DISC percentages - ensure at least 4 strengths
  const dimensions = [
    { name: 'red', value: profile.red, label: 'Dominance' },
    { name: 'yellow', value: profile.yellow, label: 'Influence' },
    { name: 'green', value: profile.green, label: 'Steadiness' },
    { name: 'blue', value: profile.blue, label: 'Conscientiousness' }
  ];
  
  dimensions.sort((a, b) => b.value - a.value);
  
  // Add strengths from all dimensions based on their percentages
  dimensions.forEach(dimension => {
    if (dimension.value >= 15) { // Include if at least 15% of profile
      switch (dimension.name) {
        case 'red':
          if (dimension.value >= 30) insights.strengths.push('Results-oriented', 'Decisive');
          else if (dimension.value >= 20) insights.strengths.push('Takes initiative');
          else insights.strengths.push('Goal-focused');
          break;
        case 'yellow':
          if (dimension.value >= 30) insights.strengths.push('Great communicator', 'Team player');
          else if (dimension.value >= 20) insights.strengths.push('Enthusiastic');
          else insights.strengths.push('Optimistic');
          break;
        case 'green':
          if (dimension.value >= 30) insights.strengths.push('Reliable', 'Supportive');
          else if (dimension.value >= 20) insights.strengths.push('Good listener');
          else insights.strengths.push('Team-oriented');
          break;
        case 'blue':
          if (dimension.value >= 30) insights.strengths.push('Detail-oriented', 'Analytical');
          else if (dimension.value >= 20) insights.strengths.push('Quality-focused');
          else insights.strengths.push('Systematic');
          break;
      }
    }
  });
  
  // Ensure we have at least 4 strengths - add universal ones if needed
  if (insights.strengths.length < 4) {
    const universalStrengths = ['Adaptable', 'Professional', 'Collaborative', 'Problem-solver', 'Communicative'];
    const needed = 4 - insights.strengths.length;
    insights.strengths.push(...universalStrengths.slice(0, needed));
  }
  
  // Generate other insights based on primary dimension
  const primary = dimensions[0];
  switch (primary.name) {
    case 'red':
      insights.challenges.push('May be impatient', 'Can be too direct', 'Might overlook details');
      insights.idealWorkEnvironment.push('Fast-paced environments', 'Goal-oriented culture', 'Independent work');
      insights.motivators.push('Challenges', 'Results', 'Recognition for achievements');
      insights.compatibleRoles.push('Leadership roles', 'Sales', 'Entrepreneurship', 'Project management');
      break;
    case 'yellow':
      insights.challenges.push('May struggle with details', 'Can be overly optimistic', 'Needs social interaction');
      insights.idealWorkEnvironment.push('Collaborative spaces', 'Social interaction', 'Varied interactions');
      insights.motivators.push('Social recognition', 'Team success', 'New experiences');
      insights.compatibleRoles.push('Marketing', 'Customer service', 'Teaching', 'Event planning');
      break;
    case 'green':
      insights.challenges.push('May resist change', 'Can be too accommodating', 'Needs time to decide');
      insights.idealWorkEnvironment.push('Stable environments', 'Supportive team', 'Clear expectations');
      insights.motivators.push('Security', 'Helping others', 'Team harmony');
      insights.compatibleRoles.push('Support roles', 'Healthcare', 'HR', 'Customer service');
      break;
    case 'blue':
      insights.challenges.push('May be perfectionist', 'Can be slow to decide', 'Prefers working alone');
      insights.idealWorkEnvironment.push('Structured environments', 'Quality-focused culture', 'Minimal interruptions');
      insights.motivators.push('Accuracy', 'Quality standards', 'Expertise recognition');
      insights.compatibleRoles.push('Analysis', 'Research', 'Quality assurance', 'Technical roles');
      break;
  }
  
  return insights;
}