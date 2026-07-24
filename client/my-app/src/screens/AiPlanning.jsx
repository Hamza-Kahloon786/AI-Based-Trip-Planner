import React from "react";
import { aiPlanningUserData } from "../constant/Constant";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiPlanningSchema } from "../constant/YupSchema";
import { useGenerateReport } from "../hooks/hooks";
import { useSelector } from "react-redux";
import { userData } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import CityAutocomplete from "../components/CityAutocomplete";
import ClimateCheck from "../components/ClimateCheck";



const CITY_FIELD_IDS = ['startingCity', 'destination']

function AiPlanning() {
  const [currentSection, setCurrentSection] = React.useState(0);
  const [apiError, setApiError] = React.useState(null);
  const [cityValidity, setCityValidity] = React.useState({ startingCity: false, destination: false });
  const { mutateAsync, isLoading } = useGenerateReport()
  const user = useSelector(userData)
  const navigator = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(AiPlanningSchema),
    mode: "onChange",
  });
  const formSections = aiPlanningUserData.sections;
  const isLastSection = currentSection === formSections.length - 1;
  const currentSectionItemKeys = formSections[currentSection]?.questions?.map(
    (item) => item.id,
  );

  const selectedEventsRaw = watch("events") || []
  const selectedEvents = Array.isArray(selectedEventsRaw)
    ? selectedEventsRaw
    : [selectedEventsRaw]

  const currentSectionHasCityFields = formSections[currentSection]?.questions?.some(
    (q) => CITY_FIELD_IDS.includes(q.id)
  )

  const citiesAllValid = !currentSectionHasCityFields ||
    CITY_FIELD_IDS.every((id) => cityValidity[id])

  const moveNextPage = async () => {
    if (!citiesAllValid) return
    const sectionValid = await trigger(currentSectionItemKeys)
    if (sectionValid) {
      setCurrentSection((prev) => Math.min(formSections.length - 1, prev + 1))
    }
  };

  const onSubmit = async (data) => {
    if (!isLastSection) return
    setApiError(null)
    const userId = localStorage.getItem('userId')
    const projectId = `${data.startingCity}-${data.destination}-${Date.now()}`;
    const result = await mutateAsync({ ...data, userId, projectId })

    // Axios errors come back as the resolved value (ClientApi swallows throws)
    if (result?.response?.data?.message) {
      setApiError(result.response.data.message)
      return
    }
    if (!result?.aiText) {
      setApiError('Failed to generate the trip plan. Please try again.')
      return
    }

    localStorage.setItem('aiStreamJobId', result.aiText)
    localStorage.setItem('aiStreamingProjectId', projectId)
    navigator('/projects')
  };
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-10 w-96 h-96 bg-indigo-200 rounded-full filter blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-violet-200 rounded-full filter blur-[120px] opacity-40"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-emerald-200 rounded-full filter blur-[120px] opacity-30"></div>
      </div>
      <form className="relative max-w-4xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full border border-indigo-100 shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-700 font-semibold text-sm">
              AI-Based Trip Planning
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
              Plan Your Dream Trip
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Share your vision with us, and our AI will create a personalized
            trip plan
          </p>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-indigo-600">
              Section {currentSection + 1} of {formSections.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(((currentSection + 1) / formSections.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{
                width: `${((currentSection + 1) / formSections.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {formSections.map((section, index) => (
            <button
              type="button"
              key={section.sectionId}
              onClick={() => setCurrentSection(index)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl whitespace-nowrap transition-all duration-300 ${currentSection === index
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                : "bg-white/80 text-gray-600 hover:bg-white border border-gray-200"
                }`}
            >
              <span>{section.icon}</span>
              <span className="text-sm font-medium">
                {section.sectionTitle}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/70 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 px-8 py-6 border-b border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
                {formSections[currentSection].icon}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-800">
                  {formSections[currentSection].sectionTitle}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Please fill in the following details
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {formSections[currentSection].questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  {question.question}
                  {question.required && (
                    <span className="text-indigo-500 text-sm">*</span>
                  )}
                </label>
                {question.type === "radio" && (
                  <div className="flex flex-wrap gap-4">
                    {question.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name={question.id}
                            {...register(question.id)}
                            value={option}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 transition-all"></div>
                          <div className="absolute inset-1 rounded-full bg-white peer-checked:opacity-0 transition-opacity"></div>
                        </div>
                        <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "checkbox" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {question.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            {...register(question.id)}
                            value={option}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 transition-all"></div>
                          <svg
                            className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                    {Object.values(
                      question?.dependsOn?.conditions?.[0]?.options || {},
                    ).map((item) => {
                      return (
                        <div>
                          <label
                            key={item}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                name={item}
                                {...register("budgetPriority")}
                                value={item}
                                className="peer sr-only"
                              />
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 transition-all"></div>
                              <svg
                                className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                              {item}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.id === "events" && selectedEvents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvents.map((event) => (
                      <div key={event} className="space-y-2">
                        <label className="text-sm text-gray-700 font-medium">{event} Guests</label>
                        <input
                          type="number"
                          min={0}
                          {...register(`guestCount_${event.replace(/\s+/g, "_").toLowerCase()}`, { valueAsNumber: true })}
                          placeholder={`Enter ${event.toLowerCase()} guests...`}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "textarea" && (
                  <textarea
                    name={question.id}
                    placeholder={`Enter ${question.question.toLowerCase()}...`}
                    rows="4"
                    {...register(question.id)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-slate-400"
                  />
                )}

                {/* City fields get Google Places Autocomplete */}
                {question.type === "text" && CITY_FIELD_IDS.includes(question.id) && (
                  <Controller
                    name={question.id}
                    control={control}
                    render={({ field }) => (
                      <CityAutocomplete
                        value={field.value}
                        onChange={(v) => {
                          field.onChange(v)
                          setCityValidity((prev) => ({ ...prev, [question.id]: false }))
                        }}
                        onBlur={field.onBlur}
                        placeholder={`Enter ${question.question.toLowerCase()}...`}
                        inputClassName="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-slate-400"
                        onValidityChange={(isValid) =>
                          setCityValidity((prev) => ({ ...prev, [question.id]: isValid }))
                        }
                      />
                    )}
                  />
                )}

                {/* All other input types */}
                {(question.type === "email" ||
                  question.type === "tel" ||
                  question.type === "number" ||
                  question.type === "date" ||
                  (question.type === "text" && !CITY_FIELD_IDS.includes(question.id))) && (
                    <input
                      type={question.type}
                      name={question.id}
                      {...register(question.id)}
                      placeholder={`Enter ${question.question.toLowerCase()}...`}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-slate-400"
                      {...(question.type === "date" && {
                        min: new Date().toISOString().split("T")[0],
                      })}
                    />
                  )}
                <p className={`text-xs text-gray-500 ${errors[question.id]?.message ? "hidden" : "block"} `}>
                  {question.required ? "Required" : "Optional"}
                </p>
                {errors[question.id] && (
                  <p className="text-red-500 text-sm">{errors[question.id].message}</p>
                )}
              </div>
            ))}

            {formSections[currentSection].questions.some((q) => q.id === "travelMonth") && (
              <ClimateCheck destination={watch("destination")} month={watch("travelMonth")} />
            )}
          </div>

          {apiError && (
            <div className="mx-8 mb-4 mt-2 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 px-8 py-6 border-t border-indigo-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${currentSection === 0
                ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-white text-gray-700 hover:shadow-lg border border-gray-200"
                }`}
              disabled={currentSection === 0}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            {currentSection < formSections.length - 1 ? (
              <button
                type="button"
                onClick={moveNextPage}
                disabled={!citiesAllValid}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!citiesAllValid ? 'Please select valid cities from the dropdown' : ''}
              >
                Next Section
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              isValid ? (
                <button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      <span>Validating route…</span>
                    </>
                  ) : (
                    <span>Generate AI Trip Plan</span>
                  )}
                </button>
              ) : (
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl opacity-50 cursor-not-allowed shadow-lg" disabled>
                  Fill all required fields
                </button>
              )
            )}
          </div>
        </div>
      </form>
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default AiPlanning;
