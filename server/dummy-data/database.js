const requests = [
  {
    id: 0,
    title: 'Broken Printer',
    description: 'The printer is printing blanks',
    location: 'Room 404, Kingsbury Factory',
    type: 'Repair',
    status: 'Not Approved/Rejected/Resolved',
    date: new Date(2000, 10, 17).toString(),
    userid: 0
  },
  {
    id: 1,
    title: 'Routine Printer Maintenance',
    description: 'The printer is schuleded for its routine maintenance',
    location: 'Room 405, Kingsbury Factory',
    type: 'Maintenance',
    status: 'Approved',
    date: new Date(2017, 11, 17).toString(),
    userid: 1
  },
  {
    id: 2,
    title: 'Repair Vapourized Printer',
    description: 'The printer has been vapourized',
    location: 'Room 400, Kingsbury Factory',
    type: 'Repair',
    status: 'Rejected',
    date: new Date(1995, 1, 17).toString(),
    userid: 0
  },
  {
    id: 3,
    title: 'Replace broken lightbulbs',
    description: 'The lightbulbs in accounting needs to be fixed',
    location: 'Room 400, Kingsbury Factory',
    type: 'Repair',
    status: 'Resolved',
    date: new Date(1995, 1, 17).toString(),
    userid: 2
  }
];
export { requests };
