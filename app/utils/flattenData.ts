import { Column } from "@silevis/reactgrid";
import { DataNode, FlattenedDataNode } from "../types/data";

function deepCopy<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj; // 기본 타입이거나 null인 경우, 그대로 반환
  }

  if (Array.isArray(obj)) {
    const copy = obj.map((item) => deepCopy(item)); // 배열 요소 복사
    return copy as unknown as T;
  }

  const copy = Object.create(Object.getPrototypeOf(obj)); // obj가 가지고 있던 모든 메서드와 상속된 프로퍼티를 그대로 사용할 수 있게 됨
  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key];
    (copy as any)[key] = deepCopy(value); // 객체 속성 복사
  });

  return copy;
}

export default function flattenData(data: DataNode[]) {
  const result: FlattenedDataNode[] = [];
  const columns: Column[] = [];

  function recurse(currentNode: DataNode, path?: FlattenedDataNode) {
    const newPath = {
      ...deepCopy(path), // spread 연산자는 상위 노드들을 참조하는 얕은 복사이기 때문에 값을 공유함. 따라서 deepCopy로 참조를 끊어줌
      [currentNode.column]: {
        value: currentNode.value,
        nodeId: currentNode.nodeId,
        parentId: currentNode.parentId,
        disabled: false,
      },
    };

    // 서버 데이터에서 컬럼 발라먹기
    if (!columns.find((col) => col.columnId === currentNode.column)) {
      columns.push({ columnId: currentNode.column, width: 150 });
    }

    if (currentNode.children) {
      currentNode.children.forEach((child) => recurse(child, newPath));
    } else {
      Object.entries(newPath).forEach(([key, value]) => {
        const lastRow = result.at(-1);
        if (lastRow) {
          value.disabled = lastRow[key]?.nodeId === value.nodeId;
        }
      });
      result.push(newPath);
    }
  }

  data.forEach((node) => recurse(node));

  return { result, columns };
}
