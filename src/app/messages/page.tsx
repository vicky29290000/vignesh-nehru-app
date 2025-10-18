import { getUser, supabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MessagesPage() {
  const user = await getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  // Fetch messages involving the user (either as sender or recipient)
  const { data: messages, error } = await supabaseServerClient
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      sender:sender_id(full_name, role),
      recipient:recipient_id(full_name, role),
      project:name
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Failed to load messages: {error.message}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {messages?.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="p-4 border rounded bg-white shadow">
              <p>
                <strong>From:</strong> {msg.sender.full_name} ({msg.sender.role})
              </p>
              <p>
                <strong>To:</strong> {msg.recipient.full_name} ({msg.recipient.role})
              </p>
              <p>
                <strong>Project:</strong> {msg.project}
              </p>
              <p>{msg.content}</p>
              <small className="text-gray-500">{new Date(msg.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
