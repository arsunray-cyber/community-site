import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Notification helper function - prepped for external API integration
async function sendNotification(userId: string, type: 'APPROVAL' | 'REJECTION' | 'ANNOUNCEMENT') {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch user profile for notification details
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', userId)
    .single()

  if (!profile) {
    console.error(`Profile not found for user: ${userId}`)
    return { success: false, error: 'Profile not found' }
  }

  // Mock notification payload - ready for Resend/Twilio integration
  const notificationPayload = {
    to: profile.email,
    subject: getTypeSubject(type),
    message: getTypeMessage(type, profile.full_name),
    timestamp: new Date().toISOString(),
  }

  // Log the notification payload (ready for external API call)
  console.log('=== NOTIFICATION PAYLOAD ===')
  console.log(JSON.stringify(notificationPayload, null, 2))
  console.log('===========================')

  // TODO: Integrate with Resend for email or Twilio for SMS
  // Example with Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     from: 'Community Portal <onboarding@yourdomain.com>',
  //     to: [profile.email],
  //     subject: notificationPayload.subject,
  //     html: notificationPayload.message,
  //   }),
  // })

  return {
    success: true,
    userId: profile.id,
    email: profile.email,
    type,
    logged: true,
  }
}

function getTypeSubject(type: string): string {
  switch (type) {
    case 'APPROVAL':
      return 'Welcome to the Community! Your Account is Activated'
    case 'REJECTION':
      return 'Registration Update - Action Required'
    case 'ANNOUNCEMENT':
      return 'New Community Announcement'
    default:
      return 'Community Portal Notification'
  }
}

function getTypeMessage(type: string, userName: string): string {
  switch (type) {
    case 'APPROVAL':
      return `
        <h1>Welcome to the Community, ${userName}!</h1>
        <p>Your registration has been approved by our administrator.</p>
        <p>You now have full access to:</p>
        <ul>
          <li>Member Directory</li>
          <li>Community Announcements</li>
          <li>Events and Activities</li>
        </ul>
        <p>Login to your account to explore all features.</p>
        <p>Best regards,<br/>Community Portal Team</p>
      `
    case 'REJECTION':
      return `
        <h1>Registration Update, ${userName}</h1>
        <p>We regret to inform you that your registration requires additional information.</p>
        <p>Please contact our administrator for more details.</p>
        <p>Best regards,<br/>Community Portal Team</p>
      `
    case 'ANNOUNCEMENT':
      return `
        <h1>New Community Announcement</h1>
        <p>Dear ${userName},</p>
        <p>A new announcement has been posted on the community portal.</p>
        <p>Please login to view the latest updates.</p>
        <p>Best regards,<br/>Community Portal Team</p>
      `
    default:
      return `Hello ${userName}, you have a new notification.`
  }
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { userId, type } = body

    if (!userId || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId or type' }),
      }
    }

    const validTypes = ['APPROVAL', 'REJECTION', 'ANNOUNCEMENT']
    if (!validTypes.includes(type)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid notification type' }),
      }
    }

    const result = await sendNotification(userId, type as any)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    }
  } catch (error: any) {
    console.error('Notification error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to send notification' }),
    }
  }
}
