# Simplified Pricing Structure - Two Options Only

## Overview
Complete simplification of employer pricing to reduce overwhelm and decision fatigue. Employers see only two clear options regardless of company size:

1. **DIY Option** - Employer manages the process themselves
2. **Fully Managed Option** - Pollen handles everything for the employer

### Important: One Role, Multiple Hires
- **Each listing covers one unique role** (e.g., "Marketing Assistant", "Customer Service Representative")
- **Hire multiple people for that role at no extra cost** (e.g., hire 3 Marketing Assistants from one listing)
- **Multiple distinct roles require separate listings** (e.g., Marketing Assistant + Sales Assistant = 2 separate purchases)

## Pricing Tiers by Company Size

### Micro Companies (1-10 employees)
- **Temporary Hire DIY**: £500
- **Temporary Hire Fully Managed**: £1,000
- **Permanent Hire DIY**: £1,000
- **Permanent Hire Fully Managed**: £2,000

### Small Companies (11-50 employees)
- **Temporary Hire DIY**: £750
- **Temporary Hire Fully Managed**: £1,500
- **Permanent Hire DIY**: £1,500
- **Permanent Hire Fully Managed**: £3,000

### Medium Companies (51-250 employees)
- **Temporary Hire DIY**: £1,000
- **Temporary Hire Fully Managed**: £2,000
- **Permanent Hire DIY**: £2,000
- **Permanent Hire Fully Managed**: £4,000

### Large Companies (250+ employees)
- **Temporary Hire DIY**: £1,500
- **Temporary Hire Fully Managed**: £3,000
- **Permanent Hire DIY**: £3,000
- **Permanent Hire Fully Managed**: £6,000

## Tenure-Based Pricing Logic

### Temporary vs Permanent Classification
- **Temporary Hire**: Contracts under 6 months duration
- **Permanent Hire**: Contracts 6 months or longer (including permanent positions)

### Examples
- **3-month contract**: Uses temporary pricing
- **6-month contract**: Uses permanent pricing
- **12-month contract**: Uses permanent pricing
- **Permanent position**: Uses permanent pricing

## Special Case: Freelancer/Contract Hiring
- **Requires consultation** - Different pricing model
- Directs to booking consultation call
- Not included in standard pricing tiers

## What Each Option Includes

### DIY Option
- Complete bespoke skills challenge creation
- Candidate matching and shortlisting
- Application review dashboard
- Direct employer-candidate communication
- Interview scheduling tools
- **Employer handles**: Final selection, feedback delivery, interview management

### Fully Managed Option
- Everything in DIY option PLUS:
- Professional interview coordination
- Candidate feedback delivery (100% guarantee)
- Hiring process consultation
- Priority support and guidance
- **Pollen handles**: End-to-end process management

## Technical Implementation Notes

### Same Core Technology
- Identical behavioral assessment system
- Same bespoke challenge generation
- Same matching algorithm
- Same candidate experience
- **Only difference**: Level of service and support

### Pricing Logic
- Company size determined during job posting
- Contract duration determines temp vs permanent pricing
- Service level (DIY/Fully Managed) chosen at checkout
- Price automatically calculated based on three factors

### Required Job Posting Questions
1. **Company Size**: "How many employees does your company have?"
   - 1-10 employees (Micro)
   - 11-50 employees (Small)
   - 51-250 employees (Medium)
   - 250+ employees (Large)

2. **Contract Duration**: "What's the expected duration of this role?"
   - Under 6 months (Temporary pricing)
   - 6 months or longer (Permanent pricing)
   - Permanent position (Permanent pricing)

3. **Employment Type**: "How will this person be employed?"
   - On your payroll
   - Freelancer/contractor (→ consultation required)

### User Experience Flow
1. **Job Posting**: Employer creates job (includes company size, duration, employment type)
2. **Pricing Calculation**: System determines temp/permanent based on duration
3. **Service Selection**: Simple two-option choice (DIY vs Fully Managed)
4. **Pricing Display**: Shows only relevant prices for their situation
5. **Role Clarification**: Clear messaging about one role per listing
6. **Checkout**: Single price, clear service description

### Pricing Display Logic Examples
- **Small company (11-50 employees) + 3-month contract**: Shows £750 DIY / £1,500 Fully Managed
- **Small company (11-50 employees) + 8-month contract**: Shows £1,500 DIY / £3,000 Fully Managed
- **Micro company (1-10 employees) + permanent role**: Shows £1,000 DIY / £2,000 Fully Managed

### Messaging Throughout Flow
- **Job Creation**: "This listing is for one unique role (e.g., Marketing Assistant)"
- **Duration Selection**: "Contracts 6+ months use permanent pricing"
- **Service Selection**: "Hire multiple people for this role at no extra cost"
- **Pricing**: "Price covers unlimited hires for this specific role"
- **Checkout**: "Need multiple distinct roles? Create additional listings"

## Benefits of This Approach

### For Employers
- **Eliminates decision paralysis** - only two clear options
- **Transparent pricing** - no hidden complexity
- **Scalable with company growth** - pricing matches resources
- **Clear value proposition** - DIY vs managed service
- **Cost-effective scaling** - hire multiple people for one role without additional fees
- **Flexible hiring** - perfect for growing teams or seasonal needs

### For Pollen
- **Simpler sales process** - less explanation needed
- **Predictable pricing model** - easy to communicate
- **Revenue scaling** - larger companies pay more
- **Clear service differentiation** - DIY vs managed

### For Implementation
- **Same technology stack** - no additional development
- **Simpler pricing logic** - three variables only
- **Easier maintenance** - fewer pricing tiers to manage
- **Better user testing** - simpler A/B testing

## Pricing Rationale

### Company Size Multipliers
- **Micro (1-10)**: Base rate - smallest budgets, highest price sensitivity
- **Small (11-50)**: 1.5x multiplier - established businesses with growth
- **Medium (51-250)**: 2x multiplier - professional HR processes
- **Large (250+)**: 3x multiplier - enterprise-level service expectations

### Service Level Differentiation
- **DIY**: Employer saves 50% by managing interviews and feedback
- **Fully Managed**: Premium service with white-glove experience
- **2x pricing difference**: Clear value proposition for managed service

### Hire Type Differentiation
- **Temporary**: Lower commitment, shorter timeline
- **Permanent**: Higher stakes, longer-term investment
- **2x pricing difference**: Reflects importance and complexity

## Implementation Priority

### Phase 1: Core Pricing Logic
- Update job posting form to capture company size and contract duration
- Create pricing calculation function with tenure-based logic
- Build two-option service selection interface
- Implement automatic price display showing only relevant options

### Phase 2: Checkout Experience
- Simplify checkout to single price display
- Clear service level descriptions
- Payment processing integration
- Confirmation and next steps

### Phase 3: Special Cases
- Freelancer/contract consultation booking
- Custom pricing for enterprise clients
- Volume discount considerations

## Implementation Details

### Pricing Calculation Function
```
function calculatePricing(companySize, contractDuration, serviceLevel) {
  // Determine hire type based on duration
  const hireType = contractDuration >= 6 ? 'permanent' : 'temporary';
  
  // Get base pricing for company size and hire type
  const basePricing = PRICING_MATRIX[companySize][hireType];
  
  // Apply service level multiplier
  const multiplier = serviceLevel === 'fully_managed' ? 2 : 1;
  
  return basePricing * multiplier;
}
```

### Job Posting Form Updates
- **Step 1**: Add company size selection (required)
- **Step 2**: Add contract duration selection (required)
- **Step 3**: Add employment type selection (required)
- **Logic**: If "Freelancer/contractor" selected → redirect to consultation booking
- **Logic**: If "On payroll" selected → continue to service selection

### Service Selection Page
- **Input**: Company size, contract duration from job posting
- **Display**: Only show the two relevant prices (DIY vs Fully Managed)
- **Example**: Small company + 3-month contract → Show £750 vs £1,500
- **Example**: Small company + 8-month contract → Show £1,500 vs £3,000

### Clear Messaging Examples
- **Duration Selection**: "Contracts 6 months or longer use permanent pricing"
- **Service Selection**: "Based on your selections (Small company, 3-month contract)"
- **Pricing Display**: "DIY: £750 | Fully Managed: £1,500"
- **Checkout**: "Price covers unlimited hires for this Marketing Assistant role"

## Competitive Advantage

### Against Traditional Recruitment
- **Transparent pricing** vs hidden fees
- **Technology-first** vs manual processes
- **Skills-based matching** vs CV screening
- **Entry-level focus** vs experience requirements
- **One role, multiple hires** vs per-candidate fees

### Against Other Platforms
- **Bespoke assessments** vs generic tests
- **Behavioral matching** vs keyword matching
- **Two clear options** vs overwhelming choice
- **Size-appropriate pricing** vs one-size-fits-all
- **Unlimited hires per role** vs per-placement charges

## Success Metrics

### Conversion Rates
- **Pricing page engagement** - time spent, bounce rate
- **Service selection** - DIY vs Fully Managed split
- **Checkout completion** - payment success rate
- **Customer satisfaction** - post-purchase surveys

### Revenue Impact
- **Average order value** by company size
- **Service mix** - DIY vs Fully Managed preference
- **Repeat business** - customer lifetime value
- **Referral rates** - word-of-mouth growth

## Risk Mitigation

### Price Sensitivity
- **Flexible payment terms** for smaller companies
- **ROI calculators** showing hiring cost savings
- **Success stories** from similar-sized companies
- **Pilot programs** for first-time users

### Service Delivery
- **Clear expectations** for each service level
- **Quality assurance** processes
- **Customer support** escalation paths
- **Satisfaction guarantees** where appropriate

## Next Steps for Implementation

1. **Update job posting form** - add company size selection
2. **Create pricing calculator** - three-variable logic
3. **Build service selection page** - two clear options
4. **Implement checkout flow** - simplified payment
5. **Add special case handling** - freelancer consultation
6. **Test with demo data** - verify pricing accuracy
7. **Update all documentation** - align with new structure