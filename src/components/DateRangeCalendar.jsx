import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../calendar.css';

const DateRangeCalendar = ({ onRangeChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon = 0, Sun = 6
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (clickedDate >= today) return; // Blocked

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      if (onRangeChange) onRangeChange({ start: clickedDate, end: null });
    } else {
      if (clickedDate > startDate) {
        setEndDate(clickedDate);
        if (onRangeChange) onRangeChange({ start: startDate, end: clickedDate });
      } else {
        setStartDate(clickedDate);
        setEndDate(null);
        if (onRangeChange) onRangeChange({ start: clickedDate, end: null });
      }
    }
  };

  const isSelected = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (startDate && endDate) {
      return d >= startDate && d <= endDate;
    }
    if (startDate) {
      return d.getTime() === startDate.getTime();
    }
    return false;
  };
  
  const isBoundary = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isStart = startDate && d.getTime() === startDate.getTime();
    const isEnd = endDate && d.getTime() === endDate.getTime();
    return { isStart, isEnd };
  };

  const renderDays = () => {
    const grid = [];
    
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = d < today;
      const isDisabled = !isPast;
      
      const selected = isSelected(day);
      const { isStart, isEnd } = isBoundary(day);
      
      let className = "calendar-day";
      if (isDisabled) className += " disabled";
      if (selected && !isDisabled) className += " selected";
      if (isStart && !isDisabled) className += " range-start";
      if (isEnd && !isDisabled) className += " range-end";
      if (!endDate && isStart && !isDisabled) className += " range-only";

      grid.push(
        <div 
          key={day} 
          className={className}
          onClick={() => !isDisabled && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button type="button" onClick={prevMonth} className="btn-icon"><ChevronLeft size={16} /></button>
        <span className="calendar-title">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button type="button" onClick={nextMonth} className="btn-icon"><ChevronRight size={16} /></button>
      </div>
      
      <div className="calendar-weekdays">
        {weekDays.map(wd => (
          <div key={wd} className="weekday">{wd}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

export default DateRangeCalendar;
