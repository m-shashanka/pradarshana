const getDateTime = (val) => {
  const date = new Date(val);
  if (date) {
    return `${date.getDate().toString()}-${(date.getMonth()+1).toString()}-${date.getFullYear().toString()} ${date.getHours().toString()}:${date.getMinutes().toString()}`;
  }
  return '';
};

export default getDateTime;
