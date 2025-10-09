import React, { useState, useRef } from 'react';
import { Button } from "@/Components/ui/button.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { UploadFile } from "@/integrations/Core.js";
import { toast } from "sonner";

export default function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;
    
    const fileUrls = files.map(f => f.url);
    await onSendMessage(message.trim(), fileUrls);
    setMessage('');
    setFiles([]);
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        const { file_url } = await UploadFile({ file });
        setFiles(prev => [...prev, { name: file.name, url: file_url }]);
      }
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload files');
    }
    
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <Paperclip className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs text-purple-900 max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[52px] max-h-32 resize-none pr-12 rounded-2xl border-slate-200 focus:border-purple-300 focus:ring-purple-200 transition-colors"
            disabled={disabled}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 text-slate-500 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-sm"
          disabled={disabled || (!message.trim() && files.length === 0)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}