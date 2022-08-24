import React, { memo, useState } from "react";
import classnames from "classnames";
import type { TCron } from "../../types";

import styles from "./style.module.less";

interface IProps {
  type: TCron;
  inputChange: (type: TCron, newVal: string) => void;
}

const cronLabel: Record<TCron, string> = {
  second: "Second (0 ~ 59)",
  minute: "Minute (0 ~ 59)",
  hour: "Hour (0 ~ 23)",
  dayOfMonth: "Day (1 ~ 31)",
  month: "Month (1 ~ 12)",
  dayOfWeek: "Week (0 ~ 7)",
};

const CronInput: React.FC<IProps> = (props) => {
  const { inputChange, type } = props;

  const [inputVal, setInputVal] = useState<string>("*");

  const inputBlur = () => {
    if (inputVal === "") {
      setInputVal("*");
      inputChange(type, "*");
    }
  };

  return (
    <div className={classnames([styles["cron-input-item"]])}>
      <div className={classnames([styles["cron-label-item"]])}>
        {cronLabel[type]}
      </div>
      <input
        className={classnames(["animation-breath", "input-underline"])}
        type="text"
        onChange={(e) => {
          const fStr = e.target.value;
          setInputVal(fStr);
          inputChange(type, fStr ? fStr : "*");
        }}
        value={inputVal}
        onBlur={inputBlur}
      ></input>
    </div>
  );
};

export default memo(CronInput);
