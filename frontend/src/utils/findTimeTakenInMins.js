const findTimeTakenInMins = (strt, end) => {
    const dateS = new Date(strt);
    const endT = new Date(end);
    if (dateS && endT) {
        const diff = (endT- dateS);
        const mins = Math.floor((diff.valueOf()) / (60*1000))
      return mins;
    }
    return 0;
  };
  
  export default findTimeTakenInMins;