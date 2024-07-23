"use client";

import { flattenData5 } from "@/app/utils/flattenData";
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
import serverData from "../../data/data5.json";
import { FlattenedDataNode5 } from "@/app/types/data";
import { DisabledCell, DisabledCellTemplate } from "./DisabledCellTemplate";

const { result, columns } = flattenData5(serverData);

const headerRow: Row = {
  rowId: "header",
  cells: columns.map((row) => ({
    type: "header",
    text: row.columnId as string,
  })),
};

const getRows = (
  data: FlattenedDataNode5[],
): Row<DefaultCellTypes | DisabledCell>[] => [
  headerRow,
  ...data.map<Row<DefaultCellTypes | DisabledCell>>((row, idx) => ({
    rowId: idx,
    cells: Object.entries(row).map(([, value]) => {
      if (typeof value === "object" && value !== null && "value" in value) {
        return {
          type: value.disabled ? "disabled" : "text",
          text: String(value.value ?? ""),
          disabled: value.disabled || false,
        };
      } else {
        return {
          type: "text",
          text: String(value ?? ""),
          disabled: false,
        };
      }
    }),
  })),
];

// const applyChangesToData = (
//   changes: CellChange<DefaultCellTypes>[],
//   prev: FlattenedDataNode5[],
// ): FlattenedDataNode5[] => {
//   // todo: 커스텀한 CellType에 따라 mutation 로직을 다르게 해줘야 함(e.g. CNTR_TYPE => 45GP 등 정해진 값만 고를 수 있게)
//   changes.forEach(({ rowId, columnId, newCell, type }) => {
//     if (type === "text") {
//       prev[Number(rowId)][columnId].value = newCell.text;
//     }
//   });
//   return [...prev];
// };

export default function RGExample() {
  const [data, setData] = useState<FlattenedDataNode5[]>(result);

  const rows = getRows(data);
  // todo: 추후에 CellType 커스텀해서 입력값을 좁힐 필요 있음(e.g. enum값들)
  // const handleChanges = (changes: CellChange<DefaultCellTypes>[]) => {
  //   setData((prev) => applyChangesToData(changes, prev));
  // };

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
      // onCellsChanged={handleChanges}
      enableRangeSelection
      enableFillHandle
      onContextMenu={simpleHandleContextMenu}
      customCellTemplates={{ disabled: new DisabledCellTemplate() }}
    />
  );
}
