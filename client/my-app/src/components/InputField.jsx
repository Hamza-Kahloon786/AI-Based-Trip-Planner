
import React from "react"

const InputField = React.forwardRef(function({ type, id, label, placeholder, error, className = "", ...rest }, ref){
    return(
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    {...rest}
                    ref={ref}
                    className={`
                        w-full px-4 py-3.5
                        bg-white
                        border ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}
                        rounded-xl
                        text-slate-900 text-sm
                        placeholder-slate-400
                        focus:outline-none focus:ring-2
                        ${error ? 'focus:ring-red-500/30 focus:border-red-500' : 'focus:ring-indigo-500/40 focus:border-indigo-500'}
                        transition-all duration-200
                        ${className}
                    `}
                />
            </div>

            {error && (
                <div className="mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-red-600">
                        {error}
                    </span>
                </div>
            )}
        </div>
    )
})

export default React.memo(InputField)
