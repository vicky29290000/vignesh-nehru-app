'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function MessageBox({ projectId, recipientId }: { projectId: string; recipientId: string }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return
    
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        project_id: projectId,
        content: message
      })
    
    if (error) {
      console.error('Message send error:', error)
    } else {
      setMessage('')
    }
    setSending(false)
  }

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button 
        onClick={sendMessage} 
        disabled={sending || !message.trim()}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}