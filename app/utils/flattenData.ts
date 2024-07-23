import { Column } from "@silevis/reactgrid";
import {
  DataNode,
  DataNode4,
  DataNode5,
  FlattenedDataNode,
  FlattenedDataNode4,
  FlattenedDataNode5,
} from "../types/data";

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

export function flattenData(data: DataNode[]) {
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
      // 행을 추가할 때 이전 행과 같은 값이면 자식노드이므로 disabled 처리
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

// 평탄화 자체를 서버에서 해줄 예정. [key: string]: { value: string | number, 기타 속성(추가예정) } 형태로 아예 처음부터 보내줄 것.
export function flattenData4(data: DataNode4[]) {
  const result: FlattenedDataNode4[] = [];
  const columns: Column[] = [];

  function iterate(currentNode: DataNode4) {
    const currentRow: FlattenedDataNode4 = {};

    Object.entries(currentNode).forEach(([key, value]) => {
      const lastRow = result.at(-1);
      const newRowValue = {
        value,
        // 무작정 이전 행과 비교하면 안됨. MBL, HBL, ... 등 순차적으로 같은지 비교해야 함
        // 그러면 일일이 순회를 돌아서 비교하는게 맞나? 너무 비효율적이지 않나?
        // 차라리 disabled를 데이터 행끼리 연결시킬 수 있는 속성을 만들어서 그걸로 판단하는게 맞지 않나
        // disabled: lastRow && lastRow[key]?.value === value ? true : false, // disabled는 서버에서 보내주는게 맞나? 클라에서 판단하는게 맞다 생각듦
        disabled: false,
      };

      // 서버 데이터에서 컬럼 발라먹기 -> 서버로 전가
      if (!columns.find((col) => col.columnId === key)) {
        columns.push({ columnId: key });
      }

      currentRow[key] = newRowValue;
    });

    result.push(currentRow);
  }

  data.forEach((node) => iterate(node));

  return { result, columns };
}

// 평탄화 자체를 서버에서 해줄 예정. [key: string]: { value: string | number, 기타 속성(추가예정) } 형태로 아예 처음부터 보내줄 것.
export function flattenData5(data: DataNode5[]) {
  const result: FlattenedDataNode5[] = [];
  const columns: Column[] = [
    { columnId: "MASTER_BL", width: 200 },
    { columnId: "HOUSE_BL", width: 150 },
    { columnId: "TRADE_DIRECTION", width: 100 },
    { columnId: "INCOTERMS", width: 100 },
    { columnId: "신규 오더번호", width: 200 },
    { columnId: "기존 오더번호", width: 100 },
    { columnId: "SHPR", width: 200 },
    { columnId: "CARGO_TYPE", width: 100 },
    { columnId: "CONTAINER_QTY", width: 100 },
    { columnId: "POL", width: 100 },
    { columnId: "POD", width: 100 },
    { columnId: "CARRIER", width: 150 },
    { columnId: "VESSEL", width: 150 },
    { columnId: "VOYAGE", width: 150 },
    { columnId: "ETD", width: 150 },
    { columnId: "ETA", width: 150 },
    { columnId: "PURCHASE_ORDER_NUMBER", width: 150 },
    { columnId: "CONTAINER_NUMBER", width: 150 },
  ];

  function recurse(currentNode: DataNode5) {
    if (!currentNode.children || currentNode.children.length === 0) {
      return result.push(currentNode);
    }

    const { children, ...parentProps } = currentNode;
    const disabledParentProps = Object.fromEntries(
      Object.entries(parentProps).map(([key, value]) => [
        key,
        { value, disabled: true },
      ]),
    );
    children.forEach((child, index) => {
      const { children: childChildren, ...childProps } = child;
      const mergedProps =
        index === 0
          ? { ...parentProps, ...childProps }
          : { ...disabledParentProps, ...childProps };

      result.push(mergedProps);

      if (childChildren) {
        recurse({ ...mergedProps, children: childChildren });
      }
    });
  }

  data.forEach((node) => recurse(node));

  return { result, columns };
}
