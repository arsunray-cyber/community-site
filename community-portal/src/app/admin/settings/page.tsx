'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';

type AppConfig = {
  id: number;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_password: string | null;
  email_from: string | null;
  resend_api_key: string | null;
  twilio_sid: string | null;
  twilio_token: string | null;
  twilio_phone: string | null;
  updated_at: string;
};

export default function AdminSettings() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(data);
      } else {
        // Create default config if none exists
        const { data: newConfig, error: insertError } = await supabase
          .from('app_config')
          .insert([{}])
          .select()
          .single();

        if (insertError) throw insertError;
        setConfig(newConfig);
      }
    } catch (error: any) {
      console.error('Error fetching config:', error);
      setMessage({ type: 'error', text: 'સેટિંગ્સ લોડ કરવામાં ભૂલ થઈ' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!config) return;

      const { error } = await supabase
        .from('app_config')
        .update({
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port,
          smtp_user: config.smtp_user,
          smtp_password: config.smtp_password,
          email_from: config.email_from,
          resend_api_key: config.resend_api_key,
          twilio_sid: config.twilio_sid,
          twilio_token: config.twilio_token,
          twilio_phone: config.twilio_phone,
        })
        .eq('id', config.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'સેટિંગ્સ સફળતાપૂર્વક સાચવ્યા!' });
    } catch (error: any) {
      console.error('Error saving config:', error);
      setMessage({ type: 'error', text: 'સેટિંગ્સ સાચવવામાં ભૂલ થઈ' });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof AppConfig, value: string | number | null) {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">સેટિંગ્સ લોડ થઈ રહી છે...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">એડમિન સેટિંગ્સ</h1>
      <p className="text-gray-600 mb-8">ઇમેઇલ અને SMS સેવાઓ માટે કોન્ફિગરેશન સેટિંગ્સ</p>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Email Configuration - SMTP */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">ઇમેઇલ કોન્ફિગરેશન (SMTP)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP હોસ્ટ</label>
              <input
                type="text"
                value={config?.smtp_host || ''}
                onChange={(e) => handleChange('smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP પોર્ટ</label>
              <input
                type="number"
                value={config?.smtp_port || ''}
                onChange={(e) => handleChange('smtp_port', parseInt(e.target.value) || null)}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP યુઝરનેમ</label>
              <input
                type="text"
                value={config?.smtp_user || ''}
                onChange={(e) => handleChange('smtp_user', e.target.value)}
                placeholder="your@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP પાસવર્ડ</label>
              <input
                type="password"
                value={config?.smtp_password || ''}
                onChange={(e) => handleChange('smtp_password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">ઇમેઇલ ફ્રોમ</label>
              <input
                type="email"
                value={config?.email_from || ''}
                onChange={(e) => handleChange('email_from', e.target.value)}
                placeholder="noreply@community.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Resend API */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Resend API (વૈકલ્પિક)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resend API કી</label>
            <input
              type="password"
              value={config?.resend_api_key || ''}
              onChange={(e) => handleChange('resend_api_key', e.target.value)}
              placeholder="re_xxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              મફત ટાયર માટે <a href="https://resend.com" target="_blank" className="text-blue-600 hover:underline">Resend.com</a> પરથી API કી મેળવો
            </p>
          </div>
        </div>

        {/* Twilio SMS Configuration */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">SMS કોન્ફિગરેશન (Twilio)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
              <input
                type="text"
                value={config?.twilio_sid || ''}
                onChange={(e) => handleChange('twilio_sid', e.target.value)}
                placeholder="ACxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
              <input
                type="password"
                value={config?.twilio_token || ''}
                onChange={(e) => handleChange('twilio_token', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twilio ફોન નંબર</label>
              <input
                type="text"
                value={config?.twilio_phone || ''}
                onChange={(e) => handleChange('twilio_phone', e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            મફત ટ્રાયલ માટે <a href="https://twilio.com" target="_blank" className="text-blue-600 hover:underline">Twilio.com</a> પરથી ક્રેડેન્શિયલ્સ મેળવો
          </p>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'સાચવી રહ્યા છે...' : 'સેટિંગ્સ સાચવો'}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ સુરક્ષા સૂચના</h3>
        <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>આ સેટિંગ્સ માત્ર એડમિન દ્વારા એક્સેસ કરી શકાય છે</li>
          <li>પાસવર્ડ અને API કીઝ એન્ક્રિપ્ટેડ ફોર્મેટમાં સાચવવામાં આવે છે</li>
          <li>નિયમિતપણે તમારા પાસવર્ડ બદલતા રહો</li>
        </ul>
      </div>
    </div>
  );
}
