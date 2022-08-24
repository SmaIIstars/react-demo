import React from "react";
import { INode } from "../../utils/D3Force/types";
import { DEFAULT_NODE } from "../constant";
import { DEFAULT_COLORS } from "../constant";

interface IProps {
  data: INode[];
}
const Node: React.FC<IProps> = (props) => {
  const { data } = props;
  const { CCircle } = DEFAULT_NODE;

  return (
    <>
      {data.map((node, index) => {
        return (
          <circle
            {...CCircle}
            style={{ fill: DEFAULT_COLORS(`${index}`) }}
            key={index}
          ></circle>
        );
      })}
    </>
  );
};

export default Node;
