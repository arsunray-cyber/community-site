'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Trustee } from '@/lib/supabase'

export default function TrusteesPage() {
  const [trustees, setTrustees] = useState<Trustee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTrustees()
  }, [])

  async function fetchTrustees() {
    try {
      const { data, error } = await supabase
        .from('trustees')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        // Don't log error if it's just "no rows found" (PGRST116)
        if (error.code !== 'PGRST116') {
          console.error('Error fetching trustees:', error)
        }
        setTrustees([])
      } else {
        setTrustees(data || [])
      }
    } catch (error) {
      console.error('Unexpected error fetching trustees:', error)
      setTrustees([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Trustees</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our dedicated trustees work tirelessly to serve the community. Reach out to them for any queries or concerns.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : trustees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No trustee information available yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustees.map(trustee => (
            <div key={trustee.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              {trustee.photo_url ? (
                <img 
                  src={trustee.photo_url} 
                  alt={trustee.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-2xl">
                    {trustee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-gray-900 text-lg">{trustee.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{trustee.role}</p>
              <div className="space-y-2 text-sm text-gray-600">
                {trustee.email && (
                  <a href={`mailto:${trustee.email}`} className="flex items-center justify-center hover:text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {trustee.email}
                  </a>
                )}
                {trustee.phone && (
                  <a href={`tel:${trustee.phone}`} className="flex items-center justify-center hover:text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {trustee.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
