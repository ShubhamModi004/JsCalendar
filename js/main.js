// declaring Days globally
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// declaring Moths globally
const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// making an object for list of holidays in 2019
const listOfHolidays = {
    ["1/0/2019"]: ["New Year's Day"],
    ["14/0/2019"]: ["Makar Sankranti/Pongal"],
    ["26/0/2019"]: ["Republic Day"],
    ["4/2/2019"]: ["Maha Shivaratri"],
    ["21/2/2019"]: ["Holi"],
    ["6/3/2019"]: ["Ugadi/Gudi Padwa"],
    ["13/3/2019"]: ["Ram Navami"],
    ["17/3/2019"]: ["Mahavir Jayanti"],
    ["19/4/2019"]: ["Good Friday"],
    ["1/4/2019"]: ["Labor Day"],
    ["18/4/2019"]: ["Budhha Purnima"],
    ["5/5/2019"]: ["Eid-ul-Fitar"],
    ["4/6/2019"]: ["Rath Yatra"],
    ["12/7/2019"]: ["Bakri Id/Eid ul-Adha"],
    ["15/7/2019"]: ["Raksha Bandhan"],
    ["15/7/2019"]: ["Independence Day"],
    ["24/7/2019"]: ["Janmashtami"],
    ["2/8/2019"]: ["Vinayaka Chaturthi"],
    ["10/8/2019"]: ["Muharram"],
    ["11/8/2019"]: ["Onam"],
    ["2/9/2019"]: ["Mathatma Gandhi Jayanti"],
    ["8/9/2019"]: ["Dussehra/Dasara"],
    ["27/9/2019"]: ["Diwali/Deepavali"],
    ["10/9/2019"]: ["Milad un Nabi"],
    ["12/9/2019"]: ["Guru Nanak's Birthday"],
    ["25/12/2019"]: ["Christmas"],
}

// class Name CALENDAR
class CALENDAR {
    constructor(props) {
        this.props = props;
        // equating the elements in our to html file to a key value pair inside elements object
        // made use of new es6 querySelector that selects the first element returned with specified id, class etc
        this.elements = {
            days: document.querySelector('.days'),
            week: document.querySelector('.week'),
            month: document.querySelector('.month'),
            year: document.querySelector('.current-year'),
            eventList: document.querySelector('.event-list'),
            currentDay: document.querySelector('.left-date'),
            currentWeekDay: document.querySelector('.left-date-week'),
            prevYear: document.querySelector('.slide-prev'),
            nextYear: document.querySelector('.slide-next')
        }
        // setting all the holidays to a list
        this.eventList = listOfHolidays;
        this.date = new Date();
        // setting the max days to 37 since a month can start on saturday hence filling the up the extra spaces 
        this.props.maxDays = 37;
        this.init();
    }


    // App methods
    init() {
        // check contructor method has an id passed  { this id = HTML tag we wish to update}
        if (!this.props.id) return false;
        this.renderContent();
        // listening for all the click events
        this.eventsTrigger();
    }

    // calling all the render methods that renders the content; 

    renderContent() {
        this.renderWeekDays();
        this.renderMonths();
        this.renderDays();
        this.renderYearandCurrentDay();
        this.renderEvents();
    }


    renderWeekDays() {
        let WeekDays = "";
        // days availablr globally
        days.forEach(week => {
            WeekDays += `<td>${week}</td>`
        });
        this.elements.week.innerHTML = `<tr>${WeekDays}</tr>`;
        let calendar = this.getCalendar();
    }

    renderMonths() {
        let months = "";
        let calendar = this.getCalendar();
        // months available globally
        // adding active class to check if the month is selected
        Months.forEach((month, id) => {
            months += `<td class="${id === calendar.active.month ? 'active' : ''}" data-month="${id}">${month}</td>`
        });
        this.elements.month.innerHTML = `<tr>${months}</tr>`;
    }

    renderDays() {
        let calendar = this.getCalendar();
        // get the number of days in previous month
        // then check for the starting of the current month and for example if staring day is saturday it returns 6 loop throught it 6 time
        let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, id) => {
            return {
                dayNumber: this.countOfDaysInNextMonth(calendar.prevMonth) - id,
                month: new Date(calendar.prevMonth).getMonth(),
                year: new Date(calendar.prevMonth).getFullYear(),
                currentMonth: false,
                hasEvent: false
            }
        }).reverse();


        // get the number of days in the current month
        let daysInActiveMonth = this.range(calendar.active.days).map((day, id) => {
            let dayNumber = id + 1;
            let today = new Date();
            return {
                dayNumber,
                today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
                month: calendar.active.month,
                year: calendar.active.year,
                selected: calendar.active.day === dayNumber,
                currentMonth: true,
                hasEvent: false
            }
        });

        // get the max days and find the number of empty spaces remaining add days of next month to calendar
        let countOfDays = this.props.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
        let daysInNextMonth = this.range(countOfDays).map((day, id) => {
            return {
                dayNumber: id + 1,
                month: new Date(calendar.nextMonth).getMonth(),
                year: new Date(calendar.nextMonth).getFullYear(),
                currentMonth: false,
                hasEvent: false
            }
        });

        // get all days from previous month , current month and next month and make an array of days
        let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];


        // looping through all the days and checking if date  isequal to the list of holidays
        // then changing has event value to true of the particular day

        days = days.map((day, i) => {
            let addingDayEvent = day;
            Object.keys(this.eventList).map((event, i) => {
                if (`${day.dayNumber}/${day.month}/${day.year}` == event) {
                    addingDayEvent.hasEvent = true
                }
            });
            return addingDayEvent;
        })
        let Days = "";
        days.forEach(day => {
            Days += `<td class="${day.hasEvent ? 'event-day' : ''} ${day.currentMonth ? '' : 'another-month'} ${day.today ? 'active-day' : ''} ${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></td>`
        })
        this.elements.days.innerHTML = `<tr>${Days}</tr>`;
    }



    renderEvents() {
        let calendar = this.getCalendar();
        // to show the list of holidays pass the formatted date same as globally passed holidays
        // check for the list of holidays for the current day
        let eventList = this.eventList[calendar.active.formatted] || ["There is no holiday today"];
        let Holiday = "";
        eventList.forEach(item => {
            Holiday += `<li>${item}</li>`
        });
        this.elements.eventList.innerHTML = Holiday;
    }


    renderYearandCurrentDay() {
        let calendar = this.getCalendar();
        this.elements.year.innerHTML = calendar.active.year;
        this.elements.currentDay.innerHTML = calendar.active.day;
        this.elements.currentWeekDay.innerHTML = days[calendar.active.week];
    }

    // get calendar method returns active day , month, year;
    // get calendar meethod returns previous/ next month and previous/ next year.

    getCalendar() {
        let time = new Date(this.date);
        return {
            active: {
                // to count the number of days in the month
                days: this.countOfDaysInNextMonth(time),
                // to get the start of the week
                startWeek: this.getStartedDayOfWeekByTime(time),
                day: time.getDate(),
                week: time.getDay(),
                month: time.getMonth(),
                year: time.getFullYear(),
                // formatting the date as per the Holidays date
                formatted: `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`,
                time: time
            },
            prevMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
            nextMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
            nextYear: new Date(new Date(time).getFullYear() + 1, 0, 1),
            prevYear: new Date(new Date(time).getFullYear() - 1, 0, 1)
        }
    }


    // counting number of days in next month
    countOfDaysInNextMonth(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month + 1, 0).getDate();
    }

    // counting number of days in next month
    getStartedDayOfWeekByTime(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month, 1).getDay();
    }

    // getting the month and year
    getMonthAndYear(time) {
        let date = new Date(time);
        return {
            year: date.getFullYear(),
            month: date.getMonth()
        }
    }


    // helper method to convert a number to an array to loop through
    range(number) {
        return new Array(number).fill().map((e, i) => i);
    }

    // Service method
    eventsTrigger() {
        this.elements.prevYear.addEventListener('click', e => {
            let calendar = this.getCalendar();
            this.date = new Date(calendar.prevYear);
            this.renderContent();
        });

        this.elements.nextYear.addEventListener('click', e => {
            let calendar = this.getCalendar();
            this.date = new Date(calendar.nextYear);
            this.renderContent()
        });
        this.elements.month.addEventListener('click', e => {
            let calendar = this.getCalendar();
            let month = e.srcElement.getAttribute('data-month');
            if (!month || calendar.active.month == month) return false;
            let newMonth = new Date(calendar.active.time).setMonth(month);
            this.date = new Date(newMonth);
            this.renderContent()
        });

        this.elements.days.addEventListener('click', e => {
            let element = e.srcElement;
            let day = element.getAttribute('data-day');
            let month = element.getAttribute('data-month');
            let year = element.getAttribute('data-year');
            if (!day) return false;
            let strDate = `${Number(month) + 1}/${day}/${year}`;
            this.date = new Date(strDate);
            this.renderContent();
        });
    }


}

// declaring an object reffering to the class and passing the id of calendar
let calendar = new CALENDAR({ id: "calendar" });
