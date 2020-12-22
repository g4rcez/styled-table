import { Table } from "./table/table";
import { FaCheck, FaEdit } from "react-icons/fa";
import "./App.css";
import logo from "./logo.svg";
import { TableColumns } from "./table/types";

const rows = [
  {
    id: "740",
    name: "CRED - 15k+ - GRUPO 99999999",
    min_tpv: 15000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "741",
    name: "CRED - 15k+ - GRUPO 1",
    min_tpv: 15000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "742",
    name: "CRED - 15k+ - GRUPO 2",
    min_tpv: 15000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "743",
    name: "CRED - 15k+ - GRUPO 3",
    min_tpv: 15000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "744",
    name: "CRED - 30k+ - GRUPO 0",
    min_tpv: 30000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "745",
    name: "CRED - 30k+ - GRUPO 1",
    min_tpv: 30000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "746",
    name: "CRED - 30k+ - GRUPO 2",
    min_tpv: 30000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "747",
    name: "CRED - 30k+ - GRUPO 3",
    min_tpv: 30000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "748",
    name: "CRED - 50k+ - GRUPO 0",
    min_tpv: 50000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "749",
    name: "CRED - 50k+ - GRUPO 1",
    min_tpv: 50000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "750",
    name: "CRED - 50k+ - GRUPO 2",
    min_tpv: 50000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "751",
    name: "CRED - 50k+ - GRUPO 3",
    min_tpv: 50000,
    max_tpv: 999999999,
    margin_limit: 0,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "fast",
  },
  {
    id: "3221",
    name: "Nane",
    min_tpv: 0,
    max_tpv: 10000,
    margin_limit: 1,
    rav_auto_required: true,
    is_active: true,
    net_or_mdr: "mdr",
    pricing_method: "default",
  },
];

const tableColumnsIndexes = [
  {
    "data-title": "Id",
    cellId: "id",
    cellProps: { style: { color: "red" } },
    headerContent: "Id",
  },
  { "data-title": "Name", cellId: "name", headerContent: "Name" },
  {
    "data-title": "Min Tpv",
    cellId: "min_tpv",
    headerContent: "Min Tpv",
  },
  {
    "data-title": "Max Tpv",
    cellId: "max_tpv",
    headerContent: "Max Tpv",
  },
  {
    "data-title": "Margin Limit",
    cellId: "margin_limit",
    headerContent: "Margin Limit",
  },
  {
    "data-title": "Rav required",
    cellId: "rav_auto_required",
    headerContent: "Rav required",
    cellRender: (e: any) => <span className="capitalize">Yes</span>,
  },
  {
    "data-title": "Active",
    cellId: "is_active",
    headerContent: "Active",
    cellRender: (e: any) => (
      <span>
        <FaCheck className="inline-block" /> Current Active
      </span>
    ),
  },
  {
    "data-title": "Actions",
    cellId: "",
    headerContent: "Actions",
    cellRender: (_: any, props: any) => (
      <span className="hover:text-primary-light color-transition hover:underline">
        <FaEdit />
      </span>
    ),
  },
];

function App() {
  return (
    <Table
      autoResize
      itemsPerPage={10}
      rows={rows}
      tableColumn={tableColumnsIndexes as any}
    />
  );
}

export default App;
