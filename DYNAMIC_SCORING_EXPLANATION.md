# Dynamic Scoring System for Bespoke Challenges

## Overview

You're absolutely correct that with infinite bespoke challenges, we need a dynamic scoring system that adapts to each employer's specific requirements. Here's how scoring categories are determined for each individual challenge:

## How Scoring Categories Are Determined

### 1. **Employer Checkpoint Configuration** (Source of Truth)

The scoring categories are dynamically generated from the employer's 5-checkpoint configuration:

```
Checkpoint 1: Role Context & Tasks → Determines role category (analytical, creative, technical, etc.)
Checkpoint 2: Communication Requirements → Adds communication-specific categories
Checkpoint 3: Quality & Attention to Detail → Adds quality control categories  
Checkpoint 4: Pressure & Multitasking → Adds pressure management categories
Checkpoint 5: Challenge Customization → Adds company-specific priorities
```

### 2. **Dynamic Category Generation Process**

#### Step 1: Core Competencies (Always Present)
- **Professional Communication** (weight varies by role)
- **Problem-Solving Approach** (universal skill)

#### Step 2: Role-Specific Categories (Based on Checkpoint 1)
- **Creative Roles** → Creative Innovation category
- **Analytical Roles** → Data Analysis & Accuracy category
- **Technical Roles** → Technical Competency category
- **Project Management** → Project Organisation category

#### Step 3: Company Priority Categories (Based on Checkpoints 3-5)
- **Attention to Detail** (if employer emphasizes quality)
- **Values Alignment** (if employer emphasizes cultural fit)
- **Pressure Management** (if employer emphasizes multitasking)

### 3. **Adaptive Weighting System**

Categories are weighted based on employer priorities:

```javascript
// Example for Marketing Assistant role
const scoringCategories = [
  {
    name: "Professional Communication",
    weight: 0.35, // Higher for client-facing roles
    evaluationCriteria: ["Clear expression", "Professional tone", "Audience awareness"]
  },
  {
    name: "Creative Innovation", 
    weight: 0.25, // Role-specific for creative positions
    evaluationCriteria: ["Original thinking", "Brand alignment", "Creative solutions"]
  },
  {
    name: "Data Analysis & Accuracy",
    weight: 0.25, // Company priority from checkpoints
    evaluationCriteria: ["Data handling", "Insight generation", "Error detection"]
  },
  {
    name: "Values Alignment",
    weight: 0.15, // Company-specific priority
    evaluationCriteria: ["Cultural fit", "Communication style", "Working approach"]
  }
];
```

## Real-World Examples

### Example 1: Creative Marketing Role
**Employer Configuration:**
- Role Category: Creative
- Company Priorities: Brand alignment, innovative thinking
- Challenge Type: Creative campaign development

**Generated Categories:**
1. Creative Innovation (30%)
2. Professional Communication (25%)
3. Brand Alignment (25%)
4. Problem-Solving Approach (20%)

### Example 2: Data Analysis Role
**Employer Configuration:**
- Role Category: Analytical
- Company Priorities: Accuracy, systematic approach
- Challenge Type: Data quality control

**Generated Categories:**
1. Data Analysis & Accuracy (35%)
2. Attention to Detail (25%)
3. Professional Communication (20%)
4. Problem-Solving Approach (20%)

### Example 3: Client-Facing Support Role
**Employer Configuration:**
- Role Category: Communication
- Company Priorities: Client satisfaction, pressure management
- Challenge Type: Customer service scenarios

**Generated Categories:**
1. Professional Communication (40%)
2. Pressure Management (25%)
3. Problem-Solving Approach (20%)
4. Values Alignment (15%)

## Technical Implementation

### Challenge Configuration Object
```javascript
const challengeConfig = {
  jobId: 123,
  challengeType: 'communication', // From employer checkpoint 2
  roleCategory: 'analytical', // From employer checkpoint 1
  companyPriorities: ['attention_to_detail', 'cultural_fit'], // From checkpoints 3-5
  taskComplexity: 'entry_level', // Platform default for 18-30 demographic
  customRequirements: {
    communicationStyle: 'professional_but_warm',
    qualityStandards: 'high_accuracy_required',
    pressureScenarios: ['multiple_deadlines', 'client_complaints']
  }
};
```

### Dynamic Scoring Process
1. **Configuration Analysis** → Parse employer checkpoint data
2. **Category Generation** → Create role-specific + company-specific categories
3. **Weight Normalization** → Ensure all weights sum to 1.0
4. **Submission Evaluation** → Score against dynamic categories
5. **Feedback Generation** → Create contextual feedback based on actual categories

## Key Benefits

### 1. **Infinite Scalability**
- Each bespoke challenge gets unique scoring criteria
- No need to maintain fixed category lists
- Automatically adapts to new role types and company requirements

### 2. **Employer Relevance**
- Scoring directly reflects what employers actually care about
- Categories match the job requirements they specified
- Feedback is contextually relevant to the specific role

### 3. **Fair Assessment**
- Candidates evaluated on criteria relevant to the specific job
- No generic scoring that might miss role-specific requirements
- Dynamic weights ensure emphasis on what matters most

## Integration with Existing System

The dynamic scoring system integrates seamlessly with:
- **Employer Checkpoint Flow** → Provides configuration data
- **Challenge Generation** → Creates role-specific assessments
- **Admin Review Process** → Validates scoring categories
- **Candidate Feedback** → Delivers relevant career guidance

## Quality Assurance

### Validation Rules
- Minimum 3, maximum 6 scoring categories per challenge
- All category weights must sum to 1.0
- Each category must have clear evaluation criteria
- Scoring logic must be appropriate for role type

### Admin Review Integration
- Admins can review and adjust generated categories
- Quality checks ensure categories align with challenge content
- Feedback loop improves category generation accuracy

This dynamic system ensures that every bespoke challenge is scored fairly and relevantly, with categories that directly reflect the employer's specific requirements and the job's actual demands.