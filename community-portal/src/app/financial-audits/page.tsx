'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { FinancialAudit } from '@/lib/supabase'

export default function FinancialAuditsPage() {
  const [audits, setAudits] = useState<FinancialAudit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAudits()
  }, [])

  async function fetchAudits() {
    try {
      const { data, error } = await supabase
        .from('financial_audits')
        .select('*')
        .order('fiscal_year', { ascending: false })

      if (error) {
        // Don't log error if it's just "no rows found" (PGRST116)
        if (error.code !== 'PGRST116') {
          console.error('Error fetching audits:', error)
        }
        setAudits([])
      } else {
        setAudits(data || [])
      }
    } catch (error) {
      console.error('Unexpected error fetching audits:', error)
      setAudits([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Audits</h1>
        <p className="text-gray-600">Transparent financial reporting for our community members.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No financial audits available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {audits.map(audit => (
            <div key={audit.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{audit.title}</h2>
                    {audit.fiscal_year && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        FY {audit.fiscal_year}
                      </span>
                    )}
                  </div>
                  {audit.description && (
                    <p className="text-gray-600 mb-4">{audit.description}</p>
                  )}
                </div>
                {audit.pdf_url && (
                  <a
                    href={audit.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    View PDF
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
