'use client'

import { DataEditor, EditableGridCell, GridCell, GridCellKind, GridColumn, Item } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { useCallback } from "react";

const data = [
  {
    "Order Number": "1",
    "Master BL":"YMJAI226330753",
    "House BL": "BSCSZN241518",
    "Shipper": "HEROIC BRAND LIMITED",
    "Container Type": "45GP",
    "Quantity": "2",
    "POL": "CNSHU",
    "POD": "KRICH",
    "Carrier": "YANGMING",
    "ETD": "2024-07-07",
    "ETA": "2024-07-10",
  },
  {
    "Order Number": "2",
    "Master BL":"YMJAI226330753",
    "House BL": "BSCSZN241519",
    "Shipper": "HEROIC BRAND LIMITED",
    "Container Type": "45GP",
    "Quantity": "2",
    "POL": "CNSHU",
    "POD": "KRICH",
    "Carrier": "YANGMING",
    "ETD": "2024-07-07",
    "ETA": "2024-07-10",
  },
  {
    "Order Number": "3",
    "Master BL":"YMJAI226330753",
    "House BL": "BSCSZN241520",
    "Shipper": "HEROIC BRAND LIMITED",
    "Container Type": "45GP",
    "Quantity": "2",
    "POL": "CNSHU",
    "POD": "KRICH",
    "Carrier": "YANGMING",
    "ETD": "2024-07-07",
    "ETA": "2024-07-10",
  },
]

const columns: GridColumn[] = [
  { title: "O_N", id: "Order Number" },
  { title: "MBL", id: "Master BL" },
  { title: "HBL", id: "House BL" },
  { title: "SHPR", id: "Shipper" },
  { title: "CNTR_TYPE", id: "Container Type" },
  { title: "QTY", id: "Quantity" },
  { title: "POL", id: "POL" },
  { title: "POD", id: "POD" },
  { title: "CARRIER", id: "Carrier" },
  { title: "ETD", id: "ETD" },
  { title: "ETA", id: "ETA" },
]

export default function Grid() {  
  const getCellContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row];
    const indexes = ["Order Number", 'Master BL', "House BL", "Shipper", "Container Type", "Quantity", "POL", "POD", "Carrier", "ETD", "ETA"] as (keyof typeof dataRow)[]
    const d = dataRow[indexes[col]];
    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: d,
      data: d,
    };
  }, []);

  const onCellEdited = useCallback((cell: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) {
        // we only have text cells, might as well just die here.
        return;
    }

    const [col, row] = cell;
    const dataRow = data[row];
    const indexes: (keyof typeof dataRow)[] = ["Order Number", 'Master BL', "House BL", "Shipper", "Container Type", "Quantity", "POL", "POD", "Carrier", "ETD", "ETA"];
    const key = indexes[col];
    data[row][key] = newValue.data;
}, []);

  return <DataEditor getCellContent={getCellContent} onCellEdited={onCellEdited} columns={columns} rows={data.length} smoothScrollX smoothScrollY/>;
}
