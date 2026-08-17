'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Announcement } from '@/lib/supabase'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('published_date', { ascending: false })

      if (error) {
        // Don't log error if it's just "no rows found" (PGRST116)
        if (error.code !== 'PGRST116') {
          console.error('Error fetching announcements:', error)
        }
        setAnnouncements([])
      } else {
        setAnnouncements(data || [])
      }
    } catch (error) {
      console.error('Unexpected error fetching announcements:', error)
      setAnnouncements([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">News & Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest community news and events.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(announcement => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(announcement.published_date).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{announcement.title}</h2>
              <p className="text-gray-600 whitespace-pre-line">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
