import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const RecurrenceArea = ({ onChange }) => {
  const [frequency, setFrequency] = useState('semanalmente');
  const [selectedDays, setSelectedDays] = useState(['1', '2', '3', '4', '5']);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [hourOfDay, setHourOfDay] = useState('09');
  const [dayOfMonth, setDayOfMonth] = useState('1');

  useEffect(() => {
    if (onChange) {
      onChange({ frequency, selectedDays, includeWeekend, hourOfDay, dayOfMonth });
    }
  }, [frequency, selectedDays, includeWeekend, hourOfDay, dayOfMonth, onChange]);

  const allDays = [
    { label: 'D', value: '0', isWeekend: true },
    { label: 'S', value: '1', isWeekend: false },
    { label: 'T', value: '2', isWeekend: false },
    { label: 'Q', value: '3', isWeekend: false },
    { label: 'Q', value: '4', isWeekend: false },
    { label: 'S', value: '5', isWeekend: false },
    { label: 'S', value: '6', isWeekend: true }
  ];

  useEffect(() => {
    if (frequency === 'diariamente') {
      if (includeWeekend) {
        setSelectedDays(['0', '1', '2', '3', '4', '5', '6']);
      } else {
        setSelectedDays(['1', '2', '3', '4', '5']);
      }
    } else if (frequency === 'semanalmente') {
      setSelectedDays(prev => {
        let newDays = prev.length > 0 ? [prev[0]] : ['1'];
        if (!includeWeekend) {
          newDays = newDays.filter(val => {
            const dayInfo = allDays.find(d => d.value === val);
            return dayInfo ? !dayInfo.isWeekend : true;
          });
          if (newDays.length === 0) newDays = ['1']; // default to Monday
        }
        return newDays;
      });
    } else {
      if (!includeWeekend) {
        setSelectedDays(prev => prev.filter(val => {
          const dayInfo = allDays.find(d => d.value === val);
          return dayInfo ? !dayInfo.isWeekend : true;
        }));
      }
    }
  }, [frequency, includeWeekend]);

  const toggleDay = (val) => {
    if (frequency === 'diariamente') return;
    
    if (frequency === 'semanalmente') {
      setSelectedDays([val]);
    } else {
      if (selectedDays.includes(val)) {
        setSelectedDays(selectedDays.filter(d => d !== val));
      } else {
        setSelectedDays([...selectedDays, val]);
      }
    }
  };

  return (
    <div className="recurrence-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 0' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', width: 'max-content' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <button type="button" className={`freq-pill ${frequency === 'diariamente' ? 'active' : ''}`} style={{ flex: 1, padding: 0 }} onClick={() => setFrequency('diariamente')}>Diária</button>
          <button type="button" className={`freq-pill ${frequency === 'semanalmente' ? 'active' : ''}`} style={{ flex: 1, padding: 0 }} onClick={() => setFrequency('semanalmente')}>Semanal</button>
          <button type="button" className={`freq-pill ${frequency === 'mensalmente' ? 'active' : ''}`} style={{ flex: 1, padding: 0 }} onClick={() => setFrequency('mensalmente')}>Mensal</button>
        </div>

        <div className="recurrence-days">
          {allDays.map((day, idx) => (
            <button 
              key={idx}
              type="button"
              className={`day-pill ${selectedDays.includes(day.value) ? 'active' : ''}`}
              onClick={() => toggleDay(day.value)}
              disabled={frequency === 'diariamente' || frequency === 'mensalmente' || (!includeWeekend && day.isWeekend)}
              style={{ opacity: (frequency === 'mensalmente' || (!includeWeekend && day.isWeekend)) ? 0.3 : 1, cursor: (frequency === 'diariamente' || frequency === 'mensalmente' || (!includeWeekend && day.isWeekend)) ? 'not-allowed' : 'pointer' }}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="switch-container" style={{ alignSelf: 'center', marginTop: '0.25rem', opacity: frequency === 'mensalmente' ? 0.5 : 1, pointerEvents: frequency === 'mensalmente' ? 'none' : 'auto' }}>
          <label className="switch-label" htmlFor="fim-semana-switch">Fim de semana</label>
          <label className="switch">
            <input 
              type="checkbox" 
              id="fim-semana-switch" 
              checked={includeWeekend}
              onChange={e => setIncludeWeekend(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div style={{ height: '0.5rem' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '190px' }}>
            <label className="recurrence-label">Hora do dia:</label>
            <input 
              type="text"
              value={hourOfDay}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, '');
                if (val === '') { setHourOfDay(''); return; }
                let num = parseInt(val, 10);
                if (num > 23) num = 23;
                setHourOfDay(num.toString());
              }}
              onBlur={() => {
                if (hourOfDay === '') setHourOfDay('00');
                else setHourOfDay(hourOfDay.toString().padStart(2, '0'));
              }}
              className="form-input"
              style={{ textAlign: 'center', width: '70px', height: '42px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '190px' }}>
            <label className="recurrence-label">Dia do mês:</label>
            <input 
              type="text"
              value={dayOfMonth}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, '');
                if (val === '') { setDayOfMonth(''); return; }
                let num = parseInt(val, 10);
                if (num > 31) num = 31;
                setDayOfMonth(num.toString());
              }}
              onBlur={() => {
                if (dayOfMonth === '' || parseInt(dayOfMonth, 10) < 1) setDayOfMonth('1');
              }}
              className="form-input"
              disabled={frequency === 'diariamente' || frequency === 'semanalmente'}
              style={{ textAlign: 'center', width: '70px', height: '42px', opacity: (frequency === 'diariamente' || frequency === 'semanalmente') ? 0.5 : 1, cursor: (frequency === 'diariamente' || frequency === 'semanalmente') ? 'not-allowed' : 'text', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default RecurrenceArea;
