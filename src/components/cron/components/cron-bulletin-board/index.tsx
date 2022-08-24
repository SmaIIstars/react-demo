import React, { memo, useState, useEffect } from "react";
import classnames from "classnames";
import cronParser from "cron-parser";
import moment from "moment";

import { formatMomentZhCn, TIMESTAMP_STR } from "@/utils/format";
import styles from "./style.module.less";

// formatMomentZhCn();
interface IProps {
  size: number;
  onSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cronStr: string;
}

const CronBulletinBoard: React.FC<IProps> = (props) => {
  const { size: logSize, onSizeChange, cronStr } = props;

  const [isValid, setIsValid] = useState(true);
  const [errInfo, setErrInfo] = useState("");
  const [intervals, setIntervals] = useState<string[]>([]);

  useEffect(() => {
    try {
      // const cronTest = "0 0 0 * * ? 2022-2023";
      // const interval = cronParser.parseExpression(cronTest);
      // console.error(cronStr);
      const interval = cronParser.parseExpression(cronStr);

      let res = [];
      for (let i = 0; i < logSize; i++) {
        const timestamp = interval.next().getTime();
        res.push(moment(timestamp).format(TIMESTAMP_STR));
      }

      setIntervals([...res]);
      setIsValid(true);
    } catch (err: any) {
      setErrInfo(err.message);
      setIsValid(false);
    }
  }, [cronStr, logSize]);

  return (
    <div className={classnames([styles["cron-bulletin-board-wrapper"]])}>
      <div className={classnames([styles["cron-bulletin-board"]])}>
        <h2>
          <span>The trigger time of the task</span>
          <input
            type="text"
            value={logSize}
            className={classnames(["animation-breath", "input-underline"])}
            onChange={onSizeChange}
          />
          <span>times in the future</span>
        </h2>

        <div className={classnames([styles["cron-feature-log"]])}>
          {isValid ? (
            <ol>
              {Array(logSize)
                .fill(0)
                .map((_, index) => {
                  return <li key={index}>{intervals[index]}</li>;
                })}
            </ol>
          ) : (
            <div>{errInfo}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CronBulletinBoard);
