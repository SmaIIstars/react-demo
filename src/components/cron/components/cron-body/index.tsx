import React, { memo, useState } from "react";
import styles from "./style.module.less";
import classnames from "classnames";

import CronInput from "../input";
import CronBulletinBoard from "../cron-bulletin-board";
/*  

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    └ day of week (0 - 7, 1L - 7L) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31, L)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)

*/
import type { TCron } from "../../types";

const CRON_VALUES: TCron[] = [
  "second",
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

const Cron = () => {
  const [inputVals, setInputVals] = useState<string[]>(
    Array(CRON_VALUES.length).fill("*")
  );
  const [logSize, setLogSize] = useState(10);

  // function
  const cronInputValChange = (key: TCron, newVal: string) => {
    const pos = CRON_VALUES.indexOf(key);
    inputVals[pos] = newVal;
    setInputVals([...inputVals]);
  };

  const logSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numVal = e.target.value ? parseInt(e.target.value) : 0;
    setLogSize(Math.min(numVal, 100));
  };

  // JSX
  return (
    <div className={classnames([styles.content])}>
      {/* Input */}
      <div className={classnames([styles["cron-input-wrapper"]])}>
        {CRON_VALUES.map((val) => {
          return (
            <CronInput key={val} inputChange={cronInputValChange} type={val} />
          );
        })}
      </div>

      {/* BulletinBoard */}
      <CronBulletinBoard
        size={logSize}
        onSizeChange={logSizeChange}
        cronStr={inputVals.join(" ")}
      />
    </div>
  );
};

export default memo(Cron);
