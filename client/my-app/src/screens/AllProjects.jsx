import React, { useEffect, useMemo, useState } from 'react'
import { useGenerateReportStream, useGetProjects } from '../hooks/hooks'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"



function AllProjects() {
  const jobId = localStorage.getItem('aiStreamJobId')
  const { data: streamText = '', isStreaming } = useGenerateReportStream(jobId)
  const [visibleText, setVisibleText] = useState('')
  const userId = localStorage.getItem('userId')
  const { data: projectsResp = {}, isLoading: projectsLoading } = useGetProjects(userId)
  const projects = projectsResp?.data || []

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState(() => projects[0]?.projectId)
  useEffect(() => {
    if (!selectedProjectId && projects?.length) {
      setSelectedProjectId(projects[0].projectId)
    }
  }, [projects])

  const selectedProject = projects.find((p) => p.projectId === selectedProjectId)

  useEffect(() => {
    if (!streamText) {
      setVisibleText('')
      return
    }

    if (visibleText.length >= streamText.length) {
      return
    }

    const timer = setTimeout(() => {
      setVisibleText(streamText.slice(0, visibleText.length + 10))
    }, 70)

    return () => clearTimeout(timer)
  }, [streamText, visibleText])

  return (
    <div className="min-h-[calc(100vh-64px)] px-5 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative py-10">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute left-4 top-4 z-10 w-10 h-10 rounded-xl bg-white/80 hover:bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-700 transition-all"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {sidebarOpen ? (
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">Select a project to view details</p>
                  </div>
                </div>

                <div className="p-3">
                    {projectsLoading ? (
                      <div className="p-4 text-sm text-gray-500">Loading projects...</div>
                    ) : projects.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">No projects yet</div>
                    ) : (
                      projects.map((project) => {
                        const isActive = project.projectId === selectedProjectId
                        const displayName = project.projectId || project._id
                        return (
                          <button
                            key={project._id}
                            type="button"
                            onClick={() => setSelectedProjectId(project.projectId)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${isActive
                              ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white border-transparent shadow-lg'
                              : 'bg-white/70 hover:bg-white border-gray-100 text-gray-800'
                              }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-semibold">{displayName}</div>
                            </div>
                          </button>
                        )
                      })
                    )}
                </div>
              </div>
            </div>
          ) : null}

          <div className={sidebarOpen ? "lg:col-span-9" : "lg:col-span-12"}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedProject?.name || 'Select a project'}</h2>
                  {selectedProject ? (
                    <p className="text-sm text-gray-500 mt-1">{selectedProject.summary}</p>
                  ) : null}
                </div>
              </div>

              <div className="p-6">
                {selectedProject ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Live AI Plan</h3>
                          <p className="text-sm text-gray-500 mt-1">{isStreaming || visibleText.length < streamText.length ? 'Generating your plan...' : 'Completed'}</p>
                        </div>
                        {isStreaming || visibleText.length < streamText.length ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-blue-100 shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-600">Loading</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="p-5 min-h-[260px] bg-gradient-to-br from-white to-blue-50/40">
                        {(() => {
                          const isGenerating = isStreaming || visibleText.length < streamText.length
                          const contentToShow = isGenerating ? visibleText : (selectedProject?.result || "")
                          if (contentToShow) {
                            return (
                              <div className="whitespace-pre-wrap text-[15px] leading-8 text-gray-700">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                >
                                  {contentToShow}
                                  {isGenerating ? <span className="inline-block w-2 h-5 ml-1 bg-blue-500 rounded-sm animate-pulse align-middle"></span> : null}
                                </ReactMarkdown>
                              </div>
                            )
                          }

                          return (
                            <div className="flex flex-col items-center justify-center min-h-[220px] text-center text-gray-500">
                              <p className="font-medium">Choose a project or generate a new AI plan.</p>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">Choose a project from the left sidebar.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllProjects
