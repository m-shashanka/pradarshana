const findTimeTaken = (strt, end) => {
    const dateS = new Date(strt);
    const endT = new Date(end);
    if (dateS && endT) {
        const diff = (endT- dateS);
        const hr = Math.floor(diff.valueOf() / (60*60*1000))
        const mins = Math.floor((diff.valueOf()%(60*60*1000)) / (60*1000))
      return `${hr} hrs:${mins} mins`;
    }
    return '-';
  };
  
  export default findTimeTaken;
  