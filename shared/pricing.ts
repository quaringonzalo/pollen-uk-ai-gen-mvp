// Ultra-Simplified Pricing Structure
// Fixed prices regardless of company size
// £1000 for temp/intern, £2000 for permanent

export interface SimplifiedPricing {
  temporaryPrice: number;
  permanentPrice: number;
  features: string[];
  guarantee: string;
  noHiddenFees: string[];
}

export const SIMPLIFIED_PRICING: SimplifiedPricing = {
  temporaryPrice: 1000,
  permanentPrice: 2000,
  features: [
    "Bespoke skills assessment creation",
    "Expert candidate shortlisting and curation",
    "Unlimited candidates for the same role",
    "Hiring insights dashboard with candidate analytics",
    "Platform-based interview scheduling tools"
  ],
  guarantee: "Money-back guarantee if no suitable candidates are found, subject to adherence to Terms and Conditions",
  noHiddenFees: [
    "No commission fees - ever",
    "No additional charges for hiring multiple candidates",
    "No extra fees for temp-to-perm conversions",
    "No setup fees, monthly subscriptions, or hidden costs"
  ]
};

export const CONTRACT_DURATION_OPTIONS = [
  { value: 'under_3_months', label: '3 months or less', months: 2, type: 'temporary' },
  { value: '3_6_months', label: '3-6 months', months: 4.5, type: 'temporary' },
  { value: '6_12_months', label: '6-12 months', months: 9, type: 'temporary' },
  { value: 'over_12_months', label: 'Over 12 months', months: 18, type: 'permanent' }
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'payroll', label: 'On your payroll' },
  { value: 'freelancer', label: 'Freelancer/contractor' }
];

/**
 * Determines if this is a high-value opportunity that needs personal consultation
 */
export function shouldRedirectToConsultation(
  hiringVolume: string,
  companySize: string,
  employeeCount: number
): boolean {
  // Large companies (250+ employees) should speak to us
  if (employeeCount >= 250) return true;
  
  // High volume hiring (5+ people) should speak to us
  if (hiringVolume === '5+') return true;
  
  return false;
}

/**
 * Gets the appropriate pricing based on contract type and duration
 */
export function getSimplifiedPricing(contractType: 'temporary' | 'permanent', durationMonths?: number): number {
  // Special case: contracts over 3 months are priced at permanent rate but may display as temporary
  if (durationMonths && durationMonths > 3) {
    return SIMPLIFIED_PRICING.permanentPrice;
  }
  
  return contractType === 'temporary' ? SIMPLIFIED_PRICING.temporaryPrice : SIMPLIFIED_PRICING.permanentPrice;
}

/**
 * Determines contract type based on duration in months
 */
export function getContractTypeFromDuration(durationMonths: number | null): 'temporary' | 'permanent' {
  if (durationMonths === null) return 'permanent';
  return durationMonths < 6 ? 'temporary' : 'permanent';
}

/**
 * Formats pricing for display
 */
export function formatPrice(price: number): string {
  return `£${price.toLocaleString()}`;
}

/**
 * Gets pricing display with guarantee messaging
 */
export function getPricingDisplayText(contractType: 'temporary' | 'permanent', isInternship: boolean = false, durationMonths?: number): {
  price: string;
  description: string;
  guarantee: string;
} {
  const price = getSimplifiedPricing(contractType, durationMonths);
  let roleType: string;
  
  if (isInternship) {
    roleType = 'internship';
  } else {
    roleType = contractType === 'temporary' ? 'fixed-term' : 'permanent';
  }
  
  return {
    price: formatPrice(price),
    description: `Fixed price for ${roleType} roles - no hidden fees`,
    guarantee: SIMPLIFIED_PRICING.guarantee
  };
}

/**
 * Validates contract duration input
 */
export function validateContractDuration(durationValue: string): {
  isValid: boolean;
  months: number | null;
  contractType: 'temporary' | 'permanent';
  error?: string;
} {
  // Handle direct contract type values (fallback cases)
  if (durationValue === 'permanent') {
    return {
      isValid: true,
      months: 12, // Default to 12 months for permanent roles
      contractType: 'permanent'
    };
  }

  if (durationValue === 'temporary') {
    return {
      isValid: true,
      months: 6, // Default to 6 months for temporary roles
      contractType: 'temporary'
    };
  }

  if (durationValue === 'internship') {
    return {
      isValid: true,
      months: 6, // Fallback for internship without specific duration
      contractType: 'temporary'
    };
  }

  // Handle specific duration selections (for both temporary and internship)
  const option = CONTRACT_DURATION_OPTIONS.find(opt => opt.value === durationValue);
  
  if (!option) {
    return {
      isValid: false,
      months: null,
      contractType: 'temporary',
      error: 'Invalid contract duration selection'
    };
  }

  return {
    isValid: true,
    months: option.months,
    contractType: option.type as 'temporary' | 'permanent'
  };
}

/**
 * Gets consultation message for high-value opportunities
 */
export function getConsultationMessage(
  hiringVolume: string,
  employeeCount: number
): string {
  if (employeeCount >= 250) {
    return "For larger companies, we recommend speaking with our team to discuss volume discounts and enterprise solutions.";
  }
  
  if (hiringVolume === '5+') {
    return "For high-volume hiring, we can provide better pricing and dedicated support. Let's discuss your specific needs.";
  }
  
  return "";
}

/**
 * Service selection options
 */
export const SERVICE_OPTIONS = [
  {
    id: 'diy',
    name: 'Manage Yourself',
    description: 'Use our platform to manage the hiring process yourself',
    benefits: [
      'Full access to our candidate matching system',
      'Direct communication with candidates',
      'Interview scheduling tools',
      'Detailed candidate assessments'
    ]
  },
  {
    id: 'managed',
    name: 'We\'ll Handle It',
    description: 'Our team manages the entire process for you',
    benefits: [
      'Dedicated account manager',
      'We handle all candidate communication',
      'Pre-screened shortlist delivered to you',
      'Interview coordination and feedback collection'
    ]
  },
  {
    id: 'consultation',
    name: 'Speak to Our Team',
    description: 'Get personalized advice and custom pricing',
    benefits: [
      'Tailored hiring strategy',
      'Volume discounts available',
      'Enterprise-level support',
      'Flexible payment terms'
    ]
  }
];