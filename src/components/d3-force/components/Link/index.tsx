import classNames from "classnames";
import React from "react";
import { ILink } from "../../utils/D3Force/types";

import styles from "./styles.module.less";
interface IProps {
  data: ILink[];
}

const Link: React.FC<IProps> = (props) => {
  const { data } = props;
  return (
    <>
      {data.map((link, index) => {
        return (
          <line className={classNames(styles["svg-g-line"])} key={index}></line>
        );
      })}
    </>
  );
};

export default Link;
