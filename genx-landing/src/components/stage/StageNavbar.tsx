import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDownload, FiShare2 } from 'react-icons/fi'

interface StageNavbarProps {
  stageName: string
  stageDescription: string
  canvasContent?: React.ReactNode
}

const StageNavbar: React.FC<StageNavbarProps> = ({ 
  stageName, 
  stageDescription,
}) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    
    try {
      // Dynamically import html2pdf to avoid type issues
      const html2pdf = (await import('html2pdf.js')).default
      
      // Create a temporary container for PDF content
      const element = document.createElement('div')
      element.style.padding = '32px'
      element.style.backgroundColor = '#ffffff'
      element.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 28px; font-weight: bold; color: #111111; margin-bottom: 8px;">
            ${stageName}
          </h1>
          <p style="color: #666666; margin-bottom: 24px; font-size: 14px;">
            ${stageDescription}
          </p>
          <p style="color: #999999; margin-bottom: 16px; font-size: 12px;">
            Exported on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div style="border-top: 1px solid #e8e8e8; padding-top: 24px;">
            <div id="pdf-canvas-content"></div>
          </div>
        </div>
      `

      // Clone the canvas content
      const canvasClone = document.querySelector('[data-canvas-export]')
      if (canvasClone) {
        const content = canvasClone.cloneNode(true) as HTMLElement
        content.style.cssText = ''
        document.getElementById('pdf-canvas-content')?.appendChild(content)
      }

      const filename = `${stageName.toLowerCase()}-workspace-${new Date().toISOString().split('T')[0]}.pdf`
      
      html2pdf()
        .set({
          margin: 10,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        })
        .from(element)
        .save()
        .then(() => {
          setIsExporting(false)
        })
        .catch(() => {
          setIsExporting(false)
        })
    } catch (error) {
      console.error('PDF export failed:', error)
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-30 border-b border-gray-200/50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="h-20 px-6 flex items-center justify-between">
        {/* Left: Back button + Stage info */}
        <div className="flex items-center gap-4">
          <Link
            to="/foundryos/get-started"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-all hover:shadow-sm"
            title="Back to FoundryOS"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          
          {/* Tab Bar Style Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                <h1 className="text-base font-display font-semibold text-gray-900">{stageName}</h1>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 ml-3">Stage Workspace</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-all hover:shadow-sm"
            title="Share workspace"
          >
            <FiShare2 className="w-5 h-5" />
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <motion.button
            onClick={handleExportPDF}
            disabled={isExporting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-semibold transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default StageNavbar
