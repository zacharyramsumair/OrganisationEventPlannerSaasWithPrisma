import { format, parse } from 'date-fns';

// Function to convert 24-hour time to 12-hour time
const convert24HourTo12Hour = (time24:any) => {
  // Parse the 24-hour time string to a Date object
  const date = parse(time24, 'HH:mm', new Date());

  // Format the Date object to a 12-hour time string
  const time12 = format(date, 'hh:mm a');

  return time12;
};

export default convert24HourTo12Hour;

// Example usage
// const time24 = '01:30';
// const time12 = convert24HourTo12Hour(time24);
// console.log(time12); 
// Output: "01:30 AM"