export default target => (e) => {
  const newSpan = document.createElement('span');
  let time = new Date();
  time = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ',' + time.getMilliseconds();
  const newContent = document.createTextNode('[' + time + '] Event dispatched: "' + e.type + '"');
  newSpan.appendChild(newContent);
  target.appendChild(newSpan);
};
