"use client";

import flattenData from "@/app/utils/flattenData";
import {
  ReactGrid,
  Row,
  CellChange,
  Id,
  MenuOption,
  CellLocation,
  SelectionMode,
  DefaultCellTypes,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useState } from "react";
import serverData from "../../data/data3.json";
import { FlattenedDataNode } from "@/app/types/data";
import { DisabledCell, DisabledCellTemplate } from "./DisabledCellTemplate";

const { result, columns } = flattenData(serverData);

const headerRow: Row = {
  rowId: "header",
  cells: columns.map((row) => ({
    type: "header",
    text: row.columnId as string,
  })),
};

const getRows = (
  data: FlattenedDataNode[],
): Row<DefaultCellTypes | DisabledCell>[] => [
  headerRow,
  ...data.map<Row<DefaultCellTypes | DisabledCell>>((row, idx) => ({
    rowId: idx,
    cells: [
      // 이전 행 정보를 기억해서 이전 행과 값이 같으면 disabled 처리
      {
        type: row.MBL.disabled ? "disabled" : "text",
        text: String(row.MBL.value ?? ""),
        disabled: row.MBL.disabled,
      },
      {
        type: row.HBL.disabled ? "disabled" : "text",
        text: String(row.HBL.value ?? ""),
        disabled: row.HBL.disabled,
      },
      {
        type: row.PO?.disabled ? "disabled" : "text",
        text: String(row.PO?.value ?? ""),
        disabled: row.PO?.disabled,
      },
    ],
  })),
];

const applyChangesToData = (
  changes: CellChange<DefaultCellTypes>[],
  prev: FlattenedDataNode[],
): FlattenedDataNode[] => {
  // todo: 커스텀한 CellType에 따라 mutation 로직을 다르게 해줘야 함(e.g. CNTR_TYPE => 45GP 등 정해진 값만 고를 수 있게)
  changes.forEach(({ rowId, columnId, newCell, type }) => {
    if (type === "text") {
      prev[Number(rowId)][columnId].value = newCell.text;
    }
  });
  return [...prev];
};

export default function RGExample() {
  const [data, setData] = useState<FlattenedDataNode[]>(result);

  const rows = getRows(data);

  // todo: 추후에 CellType 커스텀해서 입력값을 좁힐 필요 있음(e.g. enum값들)
  const handleChanges = (changes: CellChange<DefaultCellTypes>[]) => {
    setData((prev) => applyChangesToData(changes, prev));
  };

  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
    selectedRanges: Array<CellLocation[]>,
  ): MenuOption[] => {
    return menuOptions;
  };

  return (
    <ReactGrid
      columns={columns}
      rows={rows}
      onCellsChanged={handleChanges}
      enableRangeSelection
      enableRowSelection
      enableFillHandle
      onContextMenu={simpleHandleContextMenu}
      customCellTemplates={{ disabled: new DisabledCellTemplate() }}
    />
  );
}
