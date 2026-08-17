'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Profile } from '@/lib/supabase'

export default function DirectoryPage() {
  const [members, setMembers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approval_status', 'APPROVED')
        .order('full_name', { ascending: true })

      if (error) {
        // Don't log error if it's just "no rows found" (PGRST116)
        if (error.code !== 'PGRST116') {
          console.error('Error fetching members:', error)
        }
        setMembers([])
      } else {
        setMembers(data || [])
      }
    } catch (error) {
      console.error('Unexpected error fetching members:', error)
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const search = searchTerm.toLowerCase()
    return (
      member.full_name.toLowerCase().includes(search) ||
      member.native_place.toLowerCase().includes(search) ||
      member.occupation.toLowerCase().includes(search)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Member Directory</h1>
        <p className="text-gray-600 mb-6">Connect with fellow community members.</p>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, occupation, or native place..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filteredMembers.length} members found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map(member => (
              <div key={member.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-lg">
                      {member.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.full_name}</h3>
                    <p className="text-sm text-gray-600">{member.occupation}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Native Place:</span> {member.native_place}</p>
                  <p><span className="font-medium">Current Location:</span> {member.current_address.substring(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No members found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
