import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Clock, Users, TrendingUp, CheckCircle, Star, Quote } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  jobSearchDuration: z.string().min(1, 'Please select how long you\'ve been job searching'),
  currentSituation: z.string().min(1, 'Please describe your current situation'),
  whyInterested: z.string().min(50, 'Please provide at least 50 characters explaining your interest'),
  preferredStartTime: z.string().min(1, 'Please select your preferred start time'),
  commitmentConfirmation: z.boolean().refine(val => val === true, {
    message: 'You must confirm your commitment to complete the bootcamp'
  }),
  agreeToContact: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted about the bootcamp'
  })
});

type FormData = z.infer<typeof formSchema>;

export function BootcampInterest() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      jobSearchDuration: '',
      currentSituation: '',
      whyInterested: '',
      preferredStartTime: '',
      commitmentConfirmation: false,
      agreeToContact: false
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      // In a real implementation, this would submit to your backend
      console.log('Bootcamp interest submission:', data);
      
      toast({
        title: "Interest Registered!",
        description: "Thank you for your interest in Pollen Reboot. We'll be in touch soon.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Interest!</h1>
            <p className="text-lg text-gray-600 mb-8">
              We've received your application for Pollen Reboot. Our team will review your submission and get back to you within 2-3 business days.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <div className="text-left space-y-2 text-blue-800">
                <p>• We'll review your application and current job search situation</p>
                <p>• If selected, we'll contact you with bootcamp details and next steps</p>
                <p>• Selected participants will receive access to our comprehensive career development programme</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              You can continue using the platform - check your sidebar for navigation options.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-sora font-bold text-gray-900">Pollen Reboot</h1>
            <p className="text-lg font-poppins text-gray-600 mt-1">Boost your confidence and land your next role</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="rounded-xl p-8 mb-8" style={{backgroundColor: '#FFF9DB'}}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Transform Your Career in Just 5 Days</h2>
              <p className="mb-4 text-gray-700 font-medium">
                Learn all the career essentials no-one ever teaches you - from building unshakeable confidence to mastering workplace politics, we'll give you the real-world skills that actually land jobs.
              </p>
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-gray-900" />
                  <span className="font-semibold text-gray-900">Earn Community Points</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Complete the 5-day programme and earn <span className="font-semibold text-gray-900">200 community points</span>, boosting your visibility to employers on the platform and improving your job matching prospects.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">80%</div>
                  <div className="text-sm text-gray-600 font-medium">Employment within 1 month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600 font-medium">Days to complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Self-directed learning</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <Quote className="w-8 h-8 mb-4 text-gray-900" />
              <blockquote className="italic mb-4 text-gray-900 font-medium">
                "I can't tell you enough how invaluable the bootcamp has been. It honestly makes me angry that I was never taught any of this during my business degree or by any of my managers!"
              </blockquote>
              <div className="flex items-center gap-2">
                <div className="flex text-gray-900">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">Amy, Recent Bootcamp Graduate</span>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#E2007A' }} />
                Confidence Building
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Develop unshakeable confidence in professional settings and overcome imposter syndrome.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: '#E2007A' }} />
                Essential Soft Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Master communication, teamwork, problem-solving, and leadership skills that employers value.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: '#E2007A' }} />
                Career Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Learn interview techniques, workplace etiquette, and professional development strategies.</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Express Your Interest</CardTitle>
            <p className="text-gray-600">
              We're currently collecting expressions of interest to gauge demand. This helps us secure funding to make the bootcamp available to our community.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobSearchDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long have you been actively job searching?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="less-than-1-month">Less than 1 month</SelectItem>
                          <SelectItem value="1-3-months">1-3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="over-1-year">Over 1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSituation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Employment Situation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current situation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unemployed">Unemployed and actively searching</SelectItem>
                          <SelectItem value="employed-searching">Currently employed but looking for a change</SelectItem>
                          <SelectItem value="recent-graduate">Recent graduate or school leaver</SelectItem>
                          <SelectItem value="career-change">Looking to change careers</SelectItem>
                          <SelectItem value="returning-to-work">Returning to work after a break</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whyInterested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why are you interested in the Pollen Bootcamp?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what you hope to gain from the bootcamp and how it fits into your career goals..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When would you prefer to start the bootcamp?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred timing" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immediately">As soon as possible</SelectItem>
                          <SelectItem value="within-month">Within the next month</SelectItem>
                          <SelectItem value="within-3-months">Within the next 3 months</SelectItem>
                          <SelectItem value="flexible">I'm flexible with timing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commitmentConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-semibold text-amber-900">
                          I commit to completing the full 5-day Pollen Reboot programme
                        </FormLabel>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          Pollen Reboot requires dedication and consistent participation over 5 consecutive days. 
                          By checking this box, I understand the time commitment and am prepared to fully engage 
                          with all programme activities to maximise my career development.
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToContact"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to be contacted by the Pollen team about Pollen Reboot
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          We'll only use your information to contact you about Pollen Reboot and related opportunities.
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full hover:opacity-90"
                  style={{ backgroundColor: '#E2007A', color: 'white' }}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Submitting...' : 'Express Interest'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}