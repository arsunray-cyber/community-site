import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  if (!['POST', 'PUT'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = JSON.parse(event.body || '{}')
    const { userId, status } = body

    if (!userId || !status) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId or status' }),
      }
    }

    const validStatuses = ['PENDING_APPROVAL', 'APPROVED', 'REJECTED']
    if (!validStatuses.includes(status)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid status value' }),
      }
    }

    // Update profile status
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ approval_status: status })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    // Trigger notification if approved
    if (status === 'APPROVED') {
      // Call notification function
      await fetch(`${process.env.URL}/.netlify/functions/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'APPROVAL' }),
      }).catch(err => console.error('Failed to send notification:', err))
    } else if (status === 'REJECTED') {
      await fetch(`${process.env.URL}/.netlify/functions/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'REJECTION' }),
      }).catch(err => console.error('Failed to send notification:', err))
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        profile: updatedProfile,
      }),
    }
  } catch (error: any) {
    console.error('Update profile status error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to update status' }),
    }
  }
}
