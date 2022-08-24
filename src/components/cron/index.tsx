import { memo, useState, useEffect } from "react";
import classnames from "classnames";

import CronBody from "./components/cron-body";
import { formatTimestamp, TIMESTAMP_STR } from "@/utils/format";

import styles from "./style.module.less";

const Cron = () => {
  const [curTimestamp, setCurTimestamp] = useState<number>(
    new Date().getTime() / 1000
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setCurTimestamp(date.getTime() / 1000);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* <h1>Cron</h1> */}

      <div
        id="cron-root-wrapper"
        className={classnames([styles["cron-root-wrapper"]])}
      >
        <header className={classnames([styles.header])}>
          <h1>Cron Expression</h1>
        </header>

        {/* Current Timestamp */}
        <div className={classnames([styles["cur-wrapper"]])}>
          <span className={classnames([styles.label])}>Current Time: </span>
          <span className={classnames([styles.timestamp])}>
            {formatTimestamp(curTimestamp, TIMESTAMP_STR)}
          </span>
        </div>

        <CronBody />

        {/* <footer className={classnames([styles.footer])}>footer</footer> */}
      </div>
    </>
  );
};

export default memo(Cron);
