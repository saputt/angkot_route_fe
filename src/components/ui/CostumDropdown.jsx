import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder, iconColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => { 
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); 
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center h-12 px-4 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm rounded-xl cursor-pointer transition-all duration-200 ${isOpen ? 'bg-white border-blue-500 ring-2 ring-blue-100' : ''}`}>
        <MapPin className={`w-5 h-5 mr-3 ${iconColor}`} />
        <span className={`flex-1 text-sm font-medium truncate ${selectedOption ? 'text-gray-700' : 'text-gray-400'}`}>{selectedOption ? selectedOption.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-[1002] max-h-60 overflow-y-auto custom-scrollbar p-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <div key={opt.id} onClick={() => { onChange(opt.id); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-500 group-hover:text-blue-600 flex-shrink-0">{opt.icon}</div>
              <div><p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{opt.name}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;