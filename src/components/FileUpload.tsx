'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function FileUpload({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`${projectId}/${file.name}`, file)
    
    if (error) {
      console.error('Upload error:', error)
      return
    }
    
    // Create record in uploads table
    const { error: insertError } = await supabase
      .from('uploads')
      .insert({
        file_name: file.name,
        file_type: file.type.includes('pdf') ? 'pdf' : 'jpeg',
        url: data.path,
        uploaded_by: user.id,
        project_id: projectId
      })
    
    setUploading(false)
    alert('File uploaded successfully!')
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading || !file}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  )
}