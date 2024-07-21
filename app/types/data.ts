type NodeValue = string | number | boolean | object | undefined | null;

interface NodeMetadata {
  nodeId: string;
  parentId: string | null;
}

interface RowValues extends NodeMetadata {
  value: NodeValue;
}

export interface DataNode extends RowValues {
  column: string;
  children?: DataNode[];
}

export type FlattenedDataNode = {
  [key: string]: RowValues & { disabled: boolean }; // { MBL: { value: "123", nodeId: "1", parentId: null, disabled: false } }
};
