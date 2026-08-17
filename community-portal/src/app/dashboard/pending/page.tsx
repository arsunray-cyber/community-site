import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Under Review</h1>
        <p className="text-gray-600 mb-6">
          Your registration is under review by the community administrator. You will receive a notification once your account has been approved.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-800">
            This process typically takes 1-3 business days. Thank you for your patience.
          </p>
        </div>
        <a
          href="/announcements"
          className="inline-block text-blue-600 hover:underline"
        >
          Browse public announcements while you wait
        </a>
      </div>
    </div>
  )
}
