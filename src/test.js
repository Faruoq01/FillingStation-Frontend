import { useState } from "react";

const TreeNode = ({ children, ml, label }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleNode = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ marginLeft: ml }}>
      <span onClick={toggleNode}>
        {expanded ? "▼" : "►"} {label}
      </span>
      {expanded && children}
    </div>
  );
};

const Tree = ({ data }) => {
  const renderTree = (data, ml = "0px") => {
    return data.map((node) => (
      <TreeNode ml={ml} key={node.id} label={node.label}>
        {node.children &&
          node.children.length > 0 &&
          renderTree(node.children, "50px")}
      </TreeNode>
    ));
  };

  return <div>{renderTree(data)}</div>;
};

export default Tree;
