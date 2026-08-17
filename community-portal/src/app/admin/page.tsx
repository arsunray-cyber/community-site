'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Profile } from '@/lib/supabase'

export default function AdminPage() {
  const [pendingMembers, setPendingMembers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPendingMembers()
  }, [])

  async function fetchPendingMembers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approval_status', 'PENDING_APPROVAL')
        .order('created_at', { ascending: false })

      if (error) {
        // Don't log error if it's just "no rows found" (PGRST116)
        const isNoRows = 
          error.code === 'PGRST116' || 
          (error.message && error.message.includes('No rows')) ||
          (error.details && error.details.includes('Result contains no rows'));
        
        if (!isNoRows) {
          console.error('Error fetching pending members:', error)
        }
        setPendingMembers([])
      } else {
        setPendingMembers(data || [])
      }
    } catch (error: any) {
      // Suppress errors for missing tables or no rows during initial setup
      const isSetupError = 
        error?.code === 'PGRST116' ||
        (error?.message && (
          error.message.includes('No rows') || 
          error.message.includes('relation') || 
          error.message.includes('does not exist')
        ));
      
      if (!isSetupError) {
        console.error('Unexpected error fetching pending members:', error)
      }
      setPendingMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(userId: string, status: 'APPROVED' | 'REJECTED') {
    setIsProcessing(userId)
    try {
      // Call Netlify function to update status and trigger notification
      const response = await fetch('/.netlify/functions/update-profile-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      // Refresh list
      await fetchPendingMembers()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update member status. Please try again.')
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Review and approve member registrations.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Approvals ({pendingMembers.length})
              </h2>
            </div>
            
            {pendingMembers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No pending registrations to review.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingMembers.map(member => (
                  <div key={member.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{member.full_name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <p><span className="font-medium">Occupation:</span> {member.occupation}</p>
                          <p><span className="font-medium">Native Place:</span> {member.native_place}</p>
                          <p><span className="font-medium">Phone:</span> {member.phone}</p>
                          <p><span className="font-medium">Children:</span> {member.children_count}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p><span className="font-medium">Address:</span> {member.current_address}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => updateStatus(member.id, 'REJECTED')}
                          disabled={isProcessing === member.id}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateStatus(member.id, 'APPROVED')}
                          disabled={isProcessing === member.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {isProcessing === member.id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
