import { Column } from "@silevis/reactgrid";
import { DataNode, FlattenedDataNode } from "../types/data";

export default function flattenData(data: DataNode[]) {
  const result: FlattenedDataNode[] = [];
  const columns: Column[] = [];

  function recurse(currentNode: DataNode, path?: FlattenedDataNode) {
    const newPath = {
      ...path,
      [currentNode.column]: {
        value: currentNode.value,
        nodeId: currentNode.nodeId,
        parentId: currentNode.parentId,
      },
    };

    // 서버 데이터에서 컬럼 발라먹기
    if (!columns.find((col) => col.columnId === currentNode.column)) {
      columns.push({ columnId: currentNode.column, width: 150 });
    }

    if (currentNode.children) {
      currentNode.children.forEach((child) => recurse(child, newPath));
    } else {
      result.push(newPath);
    }
  }

  data.forEach((node) => recurse(node));

  return { result, columns };
}
