import { useState, useEffect } from 'react';
import './App.css';
import { format, getWeeksInMonth, getDay, getISODay, getDaysInMonth, startOfWeek, add, sub, getDate, isEqual, isBefore, isSameMonth, differenceInDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [calendarData, setCalendarData] = useState([])
  const [selectedDate, setSelectedDate] = useState({
    start: "",
    end: "",
    lastSelected: ""
  })
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()
  const weekdayOfFirstDay = getDay(currentYear, currentMonth, 1)
  const formattedTitle = format(today, 'yyyy年M月')
  const weeksInMonth = getWeeksInMonth(today)
  // const weekdayOfFirstDayISO = getISODay(new Date(currentYear, today.getMonth(), 1))
  // const daysInMonth = getDaysInMonth(new Date(currentYear, today.getMonth()))

  useEffect(()=>{
    //establish the weeks div
    let weekArray = []
    let startDateOfWeek = startOfWeek(new Date(currentYear, today.getMonth(), 1), { weekStartsOn: 1 })
    for(let i = 0; i < weeksInMonth; i++) {
      let singleWeek = []
      for (let j = 0; j < 7; j++) {
        singleWeek.push(add(new Date(startDateOfWeek), {days: j}))
      }
      weekArray.push(singleWeek)
      startDateOfWeek = add(new Date(singleWeek[6]), {days: 1})
    }
    setCalendarData(weekArray)
  }, [])
  
  useEffect(()=>{
    let selectedNode = document.querySelectorAll(".selected")
    for (let i = 0; i < selectedNode.length; i++) {
      selectedNode[i].classList.remove("selected")
    }
    if (selectedDate.start !== "") {
      document.querySelector(`[data-date="${selectedDate.start}"]`).classList.add("selected")
    }
    if (selectedDate.end !== "") {
      document.querySelector(`[data-date="${selectedDate.end}"]`).classList.add("selected")
    }

    let between = document.querySelectorAll(".between")
    for (let i = 0; i < between.length; i++) {
      between[i].classList.remove("between")
    }

    if (selectedDate.end === "" || selectedDate.start === "") return
    let betweenCount = differenceInDays(selectedDate.end, selectedDate.start)
    for (let i = 1; i < betweenCount ; i++) {
      let between = document.querySelector(`[data-date="${add(selectedDate.start, {
        days: i 
      }) }"]`)
      between.classList.add("between")
    }
  }, [selectedDate])

  const handleClickDate = (e, week, day) => {
    if (e.target.classList.contains("not-current-month")) return 
    if (selectedDate.start === "") {
      setSelectedDate({ ...selectedDate, start: calendarData[week][day], lastSelected: "start" })
    } else if (calendarData[week][day] >= selectedDate.start && selectedDate.lastSelected === "start") {
      setSelectedDate({ ...selectedDate, end: calendarData[week][day], lastSelected: "end" })
    } else if (calendarData[week][day] >= selectedDate.start && selectedDate.lastSelected === "end") {
      setSelectedDate({ start: calendarData[week][day], end: "", lastSelected: "start" })
    } else if (calendarData[week][day] < selectedDate.start) {
      setSelectedDate({ start: calendarData[week][day], end: "", lastSelected: "start" })
    }
  }
  const dateStatus = (day) => {
    if (isSameMonth(new Date(day), today)) {
      if (isEqual(new Date(day), new Date(currentYear, today.getMonth(), currentDay))) {
        return "day today"
      } else {
        return "day"
      }
    } else {
      return "not-current-month"
    } 
  }
  return (
    <div className="calendar">
      <div className="head">
        <div className="previous"><FontAwesomeIcon icon={faChevronLeft} /></div>
        <div>
          {formattedTitle}
        </div>
        <div className="next"><FontAwesomeIcon icon={faChevronRight} /></div>
      </div>
      <div className="body">
        {calendarData.map((week, weekIndex) => {
          return (
            <div className="week" key={weekIndex}>          
              {calendarData[weekIndex].map((day, dayIndex)=>{
                return <div 
                  className={dateStatus(day)} 
                  data-date={day}
                  onClick={(e) => handleClickDate(e, weekIndex, dayIndex)}>{getDate(new Date(day))}</div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App;
