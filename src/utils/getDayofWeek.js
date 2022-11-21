export const getDayOfWeek = (day) => {
  switch (day) {
    case 0:
      return 'пн';
    case 1:
      return 'вт';
    case 2:
      return 'ср';
    case 3:
      return 'чт';
    case 4:
      return 'пт';
    case 5:
      return 'сб';
    case 6:
      return 'вс';
    default:
      return '';
  }
};
