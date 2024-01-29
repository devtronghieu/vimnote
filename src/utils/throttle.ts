type ThrottleFunction = (...agrs: any[]) => void;

export const throttle = (
  callback: ThrottleFunction,
  delay: number,
): ThrottleFunction => {
  let lastExecTime = 0;
  let timeoutID: NodeJS.Timeout;

  return (...args: any[]) => {
    const currentTime = new Date().getTime();

    if (currentTime - lastExecTime < delay) {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        lastExecTime = currentTime;
        callback(...args);
      }, delay);
    } else {
      lastExecTime = currentTime;
      callback(...args);
    }
  };
};
