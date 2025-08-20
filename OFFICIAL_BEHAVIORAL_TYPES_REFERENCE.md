# Official Behavioral Types Reference - Pollen Platform

## Master List: 17+ Fun Behavioral Types (From Active Codebase)

**This document is the single source of truth for behavioral type naming conventions across the entire Pollen platform.**

### Source Files:
- Primary Logic: `server/enhanced-behavioral-assessment.ts` (lines 430-462)
- Implementation: `server/routes.ts` (lines 415-420)
- Frontend Usage: Multiple candidate profile pages

---

## Complete Official Behavioral Types

### High Combination Types (Both >= 40%)
1. **"The Rocket Launcher"** (Red 40%+ + Yellow 40%+)
   - High-energy achiever with people skills
   - Drives results through team motivation

2. **"The People Champion"** (Yellow 40%+ + Red 40%+)
   - Relationship builder with drive for results
   - Natural networker who gets things done

3. **"The Strategic Ninja"** (Red/Blue 40%+ combination)
   - Results-focused with analytical precision
   - Systematic problem solver and executor

4. **"The Team Builder"** (Yellow/Green 40%+ combination)
   - People-focused with supportive stability
   - Creates harmony while facilitating communication

### Single Dominant Types (>=50%)
5. **"The Results Machine"** (Red 50%+)
   - Pure drive for achievement and outcomes
   - Direct, decisive, goal-oriented leader

6. **"The Social Butterfly"** (Yellow 50%+)
   - Natural communicator and relationship builder
   - Energetic, engaging, people-focused

7. **"The Steady Rock"** (Green 50%+)
   - Reliable foundation and team stabilizer
   - Patient, supportive, consensus-building

8. **"The Quality Guardian"** (Blue 50%+)
   - Perfectionist with high standards
   - Detail-oriented, systematic, accuracy-focused

### Moderate Combination Types (Primary 30-49% + Secondary 20%+)
9. **"The Innovation Catalyst"** (Red 30-49% + Yellow 20%+)
   - Creative achiever who drives new ideas
   - Combines results focus with creative thinking

10. **"The Creative Genius"** (Yellow 30-49% + Red 20%+)
    - Inspiring innovator with people skills
    - Generates ideas and motivates implementation

11. **"The Problem Solver"** (Red/Blue 30-49% combination)
    - Systematic achiever who tackles challenges
    - Analytical approach with execution drive

12. **"The People Champion"** (Yellow/Green 30-49% combination)
    - Supportive communicator and team facilitator
    - Balances relationships with steady progress

13. **"The Precision Master"** (Blue/Green 30-49% combination)
    - Detail-oriented team player
    - Methodical supporter with quality focus

### Special Cases
14. **"Reliable Foundation"** (Green 50%+ specific)
    - Ultimate team stabilizer
    - Dedicated supporter and harmony keeper

15. **"Methodical Achiever"** (Blue 50%+ + Red 30%+)
    - Quality-driven results focus
    - Systematic approach to goal achievement

16. **"Balanced Professional"** (No dominant traits)
    - Versatile, situational adaptation
    - Even distribution across all styles

---

## Naming Convention Rules

### DO USE (From Codebase):
- "The [Adjective] [Noun]" format
- Fun, memorable names that candidates enjoy sharing
- Names that reflect both primary and secondary traits
- Positive, strength-based language

### DON'T USE (Outdated):
- Boring business terms like "Ambitious Influencer"
- Formal DISC terminology like "High Dominance"
- Clinical descriptions like "Results Dynamo"
- Negative or weakness-focused language

---

## Implementation Consistency

### Code References:
```javascript
// Primary function in server/enhanced-behavioral-assessment.ts
function generatePersonalityType(scores) {
  if (primary.value >= 40 && secondary.value >= 40) {
    if (primary.type === 'red' && secondary.type === 'yellow') return "The Rocket Launcher";
    if (primary.type === 'yellow' && secondary.type === 'red') return "The People Champion";
    // ... etc
  }
}
```

### Database Storage:
- DISC percentages stored in `jobSeekerProfiles` table
- Personality type names generated dynamically from percentages
- Never store type names directly in database

### Frontend Display:
- Use exact names from this reference document
- Consistent across job seeker, employer, and admin views
- Include fun emoji/icon associations where appropriate

---

## Quality Assurance Checklist

Before implementing any behavioral assessment changes:

1. ✓ Type names match this official reference exactly
2. ✓ Calculation logic matches `server/enhanced-behavioral-assessment.ts`
3. ✓ Frontend displays use consistent naming
4. ✓ Admin portal shows same type names as job seeker profiles
5. ✓ All documentation references updated to match official names

---

**Last Updated:** August 15, 2025
**Authority:** Master reference for all Pollen platform behavioral type implementations