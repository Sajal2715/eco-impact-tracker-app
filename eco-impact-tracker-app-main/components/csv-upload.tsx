"use client"

import { useState, useCallback } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export function CSVUpload() {
  const { uploadCSV, loadSampleData, isLoading, transactions } = useApp()
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      uploadCSV(content)
    }
    reader.readAsText(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const hasData = transactions.length > 0

  return (
    <section className="relative w-full">
      <div className="mb-12">
        <h2 className="font-h1 text-h1 text-primary mb-4">Welcome to Your Impact Journey</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          To begin tracking your institutional ESG metrics, please upload your financial transaction history. We'll use our restorative intelligence to map your spending to carbon impact.
        </p>
      </div>
      
      {/* Bento-style Upload Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Drag & Drop Zone */}
        <div 
          className={`col-span-1 md:col-span-8 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-12 flex flex-col items-center justify-center border-dashed border-2 transition-all group cursor-pointer shadow-sm ${
            dragActive ? 'border-primary bg-primary/5' : 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !hasData && !isLoading && document.getElementById('csv-input')?.click()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-on-surface-variant">Processing transactions with AI...</p>
            </div>
          ) : hasData ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <p className="font-medium text-on-surface">{transactions.length} transactions loaded</p>
              <p className="text-sm text-on-surface-variant">{fileName || 'Sample data'}</p>
              <button
                onClick={(e) => { e.stopPropagation(); document.getElementById('csv-input')?.click(); }}
                className="mt-4 bg-white border border-emerald-100 text-secondary px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all active:scale-95"
              >
                Upload Different File
              </button>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
              </div>
              <h3 className="font-h2 text-h2 text-on-surface mb-2">Drag and drop your CSV file</h3>
              <p className="font-body-md text-on-surface-variant mb-8">Support for standard banking export formats (.csv, .xlsx)</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); document.getElementById('csv-input')?.click(); }}
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  Select File
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); loadSampleData(); }}
                  className="bg-white border border-emerald-100 text-secondary px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all active:scale-95 text-center"
                >
                  Load Sample Data
                </button>
              </div>
            </>
          )}
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* Instructions Panel */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-8 flex-1">
            <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-6">Instructions</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-sm text-on-surface-variant">Export your last 12 months of transactions from your primary institutional account.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-sm text-on-surface-variant">Ensure columns for 'Date', 'Description', and 'Amount' are clearly labeled.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-sm text-on-surface-variant">Our AI will automatically categorize each entry for ESG scoring.</p>
              </li>
            </ul>
          </div>

          {/* Mini Data Safety Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[2rem] p-8 border border-emerald-100 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <div>
              <h5 className="text-sm font-bold text-primary mb-1">Bank-Grade Privacy</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">Your transaction data is anonymized and encrypted before processing. We never store raw banking credentials.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty State Visual Cue */}
      {!hasData && (
        <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-20 grayscale pointer-events-none">
            <div className="bg-white/70 backdrop-blur-xl border border-primary/10 w-64 h-32 rounded-2xl flex flex-col p-6 gap-3">
              <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              <div className="h-8 w-full bg-slate-100 rounded"></div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-primary/10 w-64 h-32 rounded-2xl flex flex-col p-6 gap-3">
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              <div className="h-8 w-full bg-slate-100 rounded"></div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-primary/10 w-64 h-32 rounded-2xl flex flex-col p-6 gap-3">
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-8 w-full bg-slate-100 rounded"></div>
            </div>
          </div>
          <p className="mt-8 text-slate-400 font-label-sm uppercase tracking-widest text-xs text-center">Waiting for your first upload to generate insights</p>
        </div>
      )}
    </section>
  )
}
