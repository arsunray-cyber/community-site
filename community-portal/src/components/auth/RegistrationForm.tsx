'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface RegistrationFormData {
  fullName: string
  fatherName: string
  motherName: string
  occupation: string
  childrenCount: number
  currentAddress: string
  nativePlace: string
  email: string
  phone: string
  password: string
}

const initialFormData: RegistrationFormData = {
  fullName: '',
  fatherName: '',
  motherName: '',
  occupation: '',
  childrenCount: 0,
  currentAddress: '',
  nativePlace: '',
  email: '',
  phone: '',
  password: '',
}

export default function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const supabase = createClient()

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {}

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
      if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required"
      if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required'
    }

    if (currentStep === 2) {
      if (!formData.currentAddress.trim()) newErrors.currentAddress = 'Current address is required'
      if (!formData.nativePlace.trim()) newErrors.nativePlace = 'Native place is required'
    }

    if (currentStep === 3) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'childrenCount' ? parseInt(value) || 0 : value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof RegistrationFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return

    setIsLoading(true)
    setSubmitError(null)

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Step 2: Create profile with all details
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        occupation: formData.occupation,
        children_count: formData.childrenCount,
        current_address: formData.currentAddress,
        native_place: formData.nativePlace,
        email: formData.email,
        phone: formData.phone,
        approval_status: 'PENDING_APPROVAL',
        role: 'MEMBER',
      })

      if (profileError) throw profileError

      // Success - redirect to pending page
      router.push('/dashboard/pending')
    } catch (error: any) {
      console.error('Registration error:', error)
      setSubmitError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your full name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
          Father&apos;s Name *
        </label>
        <input
          type="text"
          id="fatherName"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter father's name"
        />
        {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
      </div>

      <div>
        <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
          Mother&apos;s Name *
        </label>
        <input
          type="text"
          id="motherName"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.motherName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter mother's name"
        />
        {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
      </div>

      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          Current Occupation *
        </label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.occupation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your occupation"
        />
        {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
      </div>

      <div>
        <label htmlFor="childrenCount" className="block text-sm font-medium text-gray-700">
          Number of Children
        </label>
        <select
          id="childrenCount"
          name="childrenCount"
          value={formData.childrenCount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
      
      <div>
        <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">
          Current Whereabouts / Full Residential Address *
        </label>
        <textarea
          id="currentAddress"
          name="currentAddress"
          value={formData.currentAddress}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full rounded-md border ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your complete current address"
        />
        {errors.currentAddress && <p className="mt-1 text-sm text-red-600">{errors.currentAddress}</p>}
      </div>

      <div>
        <label htmlFor="nativePlace" className="block text-sm font-medium text-gray-700">
          Native Place / Ancestral Hometown *
        </label>
        <input
          type="text"
          id="nativePlace"
          name="nativePlace"
          value={formData.nativePlace}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.nativePlace ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your native place"
        />
        {errors.nativePlace && <p className="mt-1 text-sm text-red-600">{errors.nativePlace}</p>}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact & Account Details</h3>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="+1 234 567 8900"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Minimum 8 characters"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Registration</h2>
      
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-24 h-1 mx-2 ${
                  step > s ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Personal Info</span>
          <span>Location</span>
          <span>Contact</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Your registration will be reviewed by our administrator. You will be notified once approved.
      </p>
    </div>
  )
}
