import React from "react";
import "./index.css"

const Clock = () => {

  let date = new Date();
  let h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  let s = date.getSeconds(); // 0 - 59
  let session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  // s = (s < 10) ? "0" + s : s;
  //+ ":" + s + " " + session;
  let time = h + ":" + m

  // this.setState({ time, })

  return (
    <div id="MyClockDisplay" className="clock">{time}</div>
  );
}

export default Clock;