import React, { useState, useEffect } from 'react';

const RecurrenceArea = ({ onChange }) => {
  const [interval, setInterval] = useState(1);
  const [frequency, setFrequency] = useState('semana');
  const [selectedDays, setSelectedDays] = useState(['2']); // 'T' -> 2
  const [endType, setEndType] = useState('nunca');
  const [endDate, setEndDate] = useState('');
  const [occurrences, setOccurrences] = useState(13);

  useEffect(() => {
    if (onChange) {
      onChange({ interval, frequency, selectedDays, endType, endDate, occurrences });
    }
  }, [interval, frequency, selectedDays, endType, endDate, occurrences, onChange]);

  const daysOfWeek = [
    { label: 'D', value: '0' },
    { label: 'S', value: '1' },
    { label: 'T', value: '2' },
    { label: 'Q', value: '3' },
    { label: 'Q', value: '4' },
    { label: 'S', value: '5' },
    { label: 'S', value: '6' }
  ];

  const toggleDay = (val) => {
    if (selectedDays.includes(val)) {
      setSelectedDays(selectedDays.filter(d => d !== val));
    } else {
      setSelectedDays([...selectedDays, val]);
    }
  };

  return (
    <div className="recurrence-container">
      <div className="recurrence-row">
        <label className="recurrence-label">Repetir a cada:</label>
        <div className="recurrence-inputs">
          <input 
            type="number" 
            className="recurrence-number" 
            value={interval} 
            onChange={e => setInterval(e.target.value)}
            min="1"
          />
          <select 
            className="recurrence-select" 
            value={frequency} 
            onChange={e => setFrequency(e.target.value)}
          >
            <option value="dia">dia</option>
            <option value="semana">semana</option>
            <option value="mes">mês</option>
            <option value="ano">ano</option>
          </select>
        </div>
      </div>

      {frequency === 'semana' && (
        <div className="recurrence-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <label className="recurrence-label">Repetir:</label>
          <div className="recurrence-days">
            {daysOfWeek.map((day, idx) => (
              <button 
                key={idx}
                type="button"
                className={`day-pill ${selectedDays.includes(day.value) ? 'active' : ''}`}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="recurrence-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
        <label className="recurrence-label">Termina em</label>
        
        <div className="recurrence-end-options">
          <label className="end-option">
            <input 
              type="radio" 
              name="endType" 
              value="nunca" 
              checked={endType === 'nunca'}
              onChange={() => setEndType('nunca')}
            />
            <span className="radio-custom"></span>
            Nunca
          </label>

          <label className="end-option">
            <input 
              type="radio" 
              name="endType" 
              value="em" 
              checked={endType === 'em'}
              onChange={() => setEndType('em')}
            />
            <span className="radio-custom"></span>
            Em
            <input 
              type="date" 
              className="recurrence-date" 
              disabled={endType !== 'em'}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>

          <label className="end-option">
            <input 
              type="radio" 
              name="endType" 
              value="apos" 
              checked={endType === 'apos'}
              onChange={() => setEndType('apos')}
            />
            <span className="radio-custom"></span>
            Após
            <div className="occurrences-input-wrapper">
              <input 
                type="number" 
                className="recurrence-occurrences" 
                disabled={endType !== 'apos'}
                value={occurrences}
                onChange={e => setOccurrences(e.target.value)}
                min="1"
              />
              <span className="occurrences-label">ocorrências</span>
            </div>
          </label>
        </div>
      </div>

    </div>
  );
};

export default RecurrenceArea;
