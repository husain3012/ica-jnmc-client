import dayjs from "dayjs";
const generateCalendarLinks = (event = {}) => {
  const name = `${event.name} - ${event.appointmentType} Visit`;
  const location = "Jawaharlal Nehru Medical College, AMU,, Medical Rd, AMU Campus, Aligarh, Uttar Pradesh 202002";
  const startTime = dayjs(event.startTime).toISOString().split("T")[0].split("-").join("");
  const endTime = dayjs(event.startTime).add(1, "week").toISOString().split("T")[0].split("-").join("");
  const details = "Patient visit for needle injury";
  //   add one week to date
  const calendarLinks = {
    google: `https://www.google.com/calendar/render?action=TEMPLATE&text=${name}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`,
    office: `https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addevent&startdt=${startTime}&enddt=${endTime}&subject=${name}&location=${location}&body=${details}`,
    
  };
  return calendarLinks;
};

export default generateCalendarLinks;