import React, { useEffect, useRef, useState } from 'react'
import { useGenerateReportStream, useGetProjects } from '../hooks/hooks'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Parses "Lahore-Hunza Valley-1747000000000" → { origin: "Lahore", destination: "Hunza Valley" }
function parseRoute(projectId) {
  const str = String(projectId || '')
  const withoutTimestamp = str.replace(/-\d{13}$/, '')
  const dashIdx = withoutTimestamp.indexOf('-')
  if (!withoutTimestamp || dashIdx === -1) return null
  return {
    origin: withoutTimestamp.slice(0, dashIdx).trim(),
    destination: withoutTimestamp.slice(dashIdx + 1).trim(),
  }
}

function RouteMap({ projectId }) {
  const route = parseRoute(projectId)
  if (!route || !route.origin || !route.destination || !MAPS_KEY) return null

  const origin = encodeURIComponent(`${route.origin}, Pakistan`)
  const destination = encodeURIComponent(`${route.destination}, Pakistan`)
  const src = `https://www.google.com/maps/embed/v1/directions?key=${MAPS_KEY}&origin=${origin}&destination=${destination}&mode=driving`

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-emerald-50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-800">Route Map</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {route.origin}
            <span className="mx-1.5 text-indigo-400">→</span>
            {route.destination}
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/dir/${origin}/${destination}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Maps
        </a>
      </div>

      {/* Map iframe */}
      <div className="relative w-full" style={{ height: '380px' }}>
        <iframe
          title="Route Map"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-slate-400">
          Driving route powered by Google Maps. Actual travel time may vary.
        </p>
      </div>
    </div>
  )
}

function AllProjects() {
  const jobId = localStorage.getItem('aiStreamJobId')
  const streamingProjectId = localStorage.getItem('aiStreamingProjectId')
  const { data: streamText = '', isStreaming } = useGenerateReportStream(jobId)
  const [visibleText, setVisibleText] = useState('')
  const userId = localStorage.getItem('userId')
  const { data: projectsResp = {}, isLoading: projectsLoading } = useGetProjects(userId)
  const projects = projectsResp?.data || []
  const planRef = useRef(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState(() => projects[0]?._id)

  useEffect(() => {
    if (!selectedProjectId && projects?.length) {
      setSelectedProjectId(projects[0]._id)
    }
  }, [projects])

  const selectedProject = projects.find((p) => p._id === selectedProjectId)

  useEffect(() => {
    setVisibleText('')
  }, [selectedProjectId])

  useEffect(() => {
    if (!streamText) { setVisibleText(''); return }
    if (visibleText.length >= streamText.length) return
    const timer = setTimeout(() => {
      setVisibleText(streamText.slice(0, visibleText.length + 10))
    }, 70)
    return () => clearTimeout(timer)
  }, [streamText, visibleText])

  const isGenerating = selectedProject?.projectId === streamingProjectId && (isStreaming || visibleText.length < streamText.length)
  const contentToShow = isGenerating ? visibleText : (selectedProject?.result || '')

  const downloadPDF = () => {
    if (!planRef.current || !contentToShow) return
    const route = parseRoute(selectedProject?.projectId)
    const title = route ? `Trip Plan — ${route.origin} to ${route.destination}` : 'Trip Plan'
    const pw = window.open('', '_blank')
    if (!pw) return
    pw.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    font-size: 13.5px; line-height: 1.75; color: #1e293b;
    background: #fff; padding: 48px 52px; max-width: 860px; margin: 0 auto;
  }
  .doc-title {
    font-size: 22px; font-weight: 700; color: #1e40af;
    border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 24px;
  }
  h1 { font-size: 20px; font-weight: 700; color: #1e40af; margin: 28px 0 10px; }
  h2 {
    font-size: 17px; font-weight: 700; color: #1d4ed8;
    margin: 28px 0 10px; border-left: 4px solid #3b82f6; padding-left: 10px;
  }
  h3 { font-size: 14.5px; font-weight: 600; color: #334155; margin: 16px 0 6px; }
  p { margin: 6px 0; }
  ul { list-style: disc; padding-left: 22px; margin: 6px 0; }
  ol { list-style: decimal; padding-left: 22px; margin: 6px 0; }
  li { margin: 4px 0; }
  strong { font-weight: 700; color: #0f172a; }
  em { font-style: italic; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
  th {
    background: #eff6ff; border: 1px solid #bfdbfe;
    padding: 9px 13px; text-align: left; font-weight: 600; color: #1e3a8a;
  }
  td { border: 1px solid #e2e8f0; padding: 8px 13px; color: #334155; }
  tr:nth-child(even) td { background: #f8fafc; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
  code {
    background: #f1f5f9; padding: 2px 5px; border-radius: 4px;
    font-family: "Courier New", monospace; font-size: 12px; color: #7c3aed;
  }
  blockquote {
    border-left: 4px solid #93c5fd; background: #eff6ff;
    padding: 10px 16px; margin: 12px 0; color: #1e40af; border-radius: 0 6px 6px 0;
  }
  @page { margin: 15mm 12mm; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<p class="doc-title">${title}</p>
${planRef.current.innerHTML}
<script>setTimeout(function(){ window.print(); }, 300);<\/script>
</body>
</html>`)
    pw.document.close()
  }

  // Sidebar display name helper
  const getDisplayName = (project) => {
    const rawId = String(project.projectId || '')
    const withoutTimestamp = rawId.replace(/-\d{13}$/, '')
    const dashIdx = withoutTimestamp.indexOf('-')
    if (dashIdx === -1) return rawId ? `Trip #${rawId}` : 'Untitled Trip'
    return `${withoutTimestamp.slice(0, dashIdx)} → ${withoutTimestamp.slice(dashIdx + 1)}`
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-5 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative py-10">

        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute left-4 top-4 z-10 w-10 h-10 rounded-xl bg-white/80 hover:bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-700 transition-all"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Sidebar ── */}
          {sidebarOpen && (
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                  <p className="text-sm text-gray-500 mt-1">Select a project to view details</p>
                </div>
                <div className="p-3">
                  {projectsLoading ? (
                    <div className="p-4 text-sm text-gray-500">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No projects yet</div>
                  ) : (
                    projects.map((project) => {
                      const isActive = project._id === selectedProjectId
                      const dateStr = project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                        : ''
                      return (
                        <button
                          key={project._id}
                          type="button"
                          onClick={() => setSelectedProjectId(project._id)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all border mb-1 ${isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white border-transparent shadow-lg'
                            : 'bg-white/70 hover:bg-white border-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-semibold text-sm truncate">{getDisplayName(project)}</div>
                          {dateStr && (
                            <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{dateStr}</div>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Main Content ── */}
          <div className={sidebarOpen ? "lg:col-span-9" : "lg:col-span-12"}>
            {selectedProject ? (
              <div className="space-y-5">

                {/* ── AI Plan Card ── */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">AI Trip Plan</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {isGenerating ? 'Generating your plan...' : 'Completed'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isGenerating && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-blue-100 shadow-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-sm font-medium text-blue-600">Generating</span>
                        </div>
                      )}
                      {contentToShow && !isGenerating && (
                        <button
                          type="button"
                          onClick={downloadPDF}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDF
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-5 min-h-[260px] bg-gradient-to-br from-white to-blue-50/40">
                    {contentToShow ? (
                      <div ref={planRef} className="text-[15px] leading-7 text-gray-700 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-blue-50 [&_th]:border [&_th]:border-blue-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_tr:nth-child(even)]:bg-gray-50 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-blue-700 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_hr]:border-gray-200 [&_hr]:my-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {contentToShow}
                        </ReactMarkdown>
                        {isGenerating && (
                          <span className="inline-block w-2 h-5 ml-1 bg-blue-500 rounded-sm animate-pulse align-middle" />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[220px] text-center text-gray-500">
                        <p className="font-medium">Choose a project or generate a new AI plan.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Google Maps Route Card ── */}
                <RouteMap projectId={selectedProject.projectId} />

              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-10 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-700">No project selected</p>
                  <p className="text-sm text-slate-400 mt-1">Choose a project from the left sidebar to view your AI plan and route map.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllProjects
