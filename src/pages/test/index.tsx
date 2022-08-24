import React, { memo } from "react";
import classnames from "classnames";

import "./index.less";

const Test = () => {
  return (
    <div className={classnames("poetries-wrapper")}>
      <div className={classnames("poetry-wrapper")}>
        <div className={classnames("poetry-title-wrapper")}>
          <div>1</div>

          <div className={classnames("poetry-title")}>
            <div>2</div>
            <div>3</div>
          </div>

          <div>4</div>
        </div>

        <div className={classnames("poetry-content")}>
          <div>5</div>
          <div>6</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Test);
