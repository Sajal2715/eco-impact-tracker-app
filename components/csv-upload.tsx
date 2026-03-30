"use client"

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="border-2 border-dashed border-primary/30 bg-card/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Upload Transactions
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your Paytm transaction CSV to analyze your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : hasData
              ? 'border-primary/50 bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing transactions...</p>
            </div>
          ) : hasData ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <p className="font-medium text-foreground">{transactions.length} transactions loaded</p>
              <p className="text-sm text-muted-foreground">{fileName || 'Sample data'}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('csv-input')?.click()}
                className="mt-2"
              >
                Upload Different File
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="default"
                  onClick={() => document.getElementById('csv-input')?.click()}
                >
                  Select File
                </Button>
                <Button variant="outline" onClick={loadSampleData}>
                  Load Sample Data
                </Button>
              </div>
            </div>
          )}
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">Expected CSV format:</p>
          <code className="mt-1 block text-xs text-foreground/70">
            date, amount, merchant, location
          </code>
          <code className="block text-xs text-foreground/70">
            2024-01-15, 2500, Reliance Petrol, Delhi
          </code>
        </div>
      </CardContent>
    </Card>
  )
}
