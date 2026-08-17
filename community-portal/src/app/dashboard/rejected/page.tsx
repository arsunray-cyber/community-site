import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function RejectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Update Required</h1>
        <p className="text-gray-600 mb-6">
          We regret to inform you that your registration requires additional information or clarification.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left">
          <p className="text-sm text-red-800 mb-2 font-semibold">Next Steps:</p>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            <li>Contact our administrator for more details</li>
            <li>Provide any additional documentation if requested</li>
            <li>You may re-register after addressing the concerns</li>
          </ul>
        </div>
        <div className="space-x-4">
          <a
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Re-register
          </a>
          <a
            href="/trustees"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
          >
            Contact Trustees
          </a>
        </div>
      </div>
    </div>
  )
}
