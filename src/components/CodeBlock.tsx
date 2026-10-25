import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  language?: string;
  code: string;
  badge?: string;
  downloadFileName?: string;
  launchUrl?: {
    label: string;
    url: string;
  };
  helperText?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  title,
  language = 'text',
  code,
  badge,
  downloadFileName,
  launchUrl,
  helperText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!downloadFileName) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAndLaunch = async () => {
    await handleCopy();
    if (launchUrl) {
      window.open(launchUrl.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="my-5 rounded-lg overflow-hidden border border-[#DADCE0] bg-[#202124] text-[#E8EAED] shadow-sm">
      {/* Authentic Google Codelabs Dark Code Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#292A2D] border-b border-[#3C4043]">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-[#E8EAED]">
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-[#1A73E8]/20 text-[#8AB4F8] border border-[#8AB4F8]/30">
              {badge}
            </span>
          )}
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#3C4043] text-[#9AA0A6]">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {downloadFileName && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#3C4043] hover:bg-[#4F5357] text-[#E8EAED] transition"
              title={`Download ${downloadFileName}`}
            >
              <Download className="w-3.5 h-3.5 text-[#81C995]" />
              <span>{downloadFileName}</span>
            </button>
          )}

          {launchUrl && (
            <button
              onClick={handleCopyAndLaunch}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-[#1A73E8] hover:bg-[#1765CC] text-white transition"
            >
              <span>Copy & Open {launchUrl.label}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
              copied
                ? 'bg-[#1E8E3E] text-white'
                : 'bg-[#3C4043] hover:bg-[#4F5357] text-[#E8EAED]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <pre className="p-4 text-[13px] leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap break-words text-[#E8EAED] selection:bg-[#1A73E8]/40">
        <code>{code}</code>
      </pre>

      {helperText && (
        <div className="px-4 py-2 bg-[#292A2D] border-t border-[#3C4043] text-xs text-[#9AA0A6] flex items-center justify-between">
          <span>{helperText}</span>
          {copied && (
            <span className="text-[#81C995] font-medium">
              Copied to clipboard
            </span>
          )}
        </div>
      )}
    </div>
  );
};
