import React from 'react';

export default function LessonsNav({ units, lessons, selectedLessonId, onSelectLesson }) {
  return (
    <nav className="lp-nav">
      {units.map(unit => {
        const unitLessons = lessons.filter(l => l.unit_id === unit.id);
        return (
          <div key={unit.id} className="lp-nav-unit">
            <div className="lp-nav-unit-label">Unit {unit.display_order}: {unit.title}</div>
            {unitLessons.map(lesson => (
              <button
                key={lesson.id}
                className={`lp-nav-lesson${selectedLessonId === lesson.id ? ' active' : ''}`}
                onClick={() => onSelectLesson(lesson.id)}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        );
      })}
    </nav>
  );
}
