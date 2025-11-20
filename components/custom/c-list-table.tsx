"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ColumnKey<T> = keyof T | (keyof T)[];

interface TableColumn<T extends Record<string, unknown>> {
  name: string;
  key: ColumnKey<T>;
  width?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListTableProps<T extends Record<string, unknown>> {
  nameTable?: string;
  columns: TableColumn<T>[];
  data: T[];
  paginationInfo?: PaginationInfo;
  paginationNextPage?: () => void;
  paginationPreviousPage?: () => void;
  paginationGoPage?: (page: number) => void;
  renderCell?: (
    column: TableColumn<T>,
    row: T,
    index: number
  ) => React.ReactNode;
  cardVariant?: "default" | "card" | "small";
}

export function ListTable<T extends Record<string, unknown>>({
  nameTable,
  columns,
  data,
  paginationInfo,
  paginationNextPage,
  paginationPreviousPage,
  paginationGoPage,
  renderCell,
  cardVariant = "default",
}: ListTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const hasData = data.length > 0;

  useEffect(() => {
    if (cardVariant !== "card") return;

    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setContainerSize((prev) => {
        const newWidth = rect.width - 4; // 4px menos
        if (prev.width === newWidth && prev.height === rect.height) return prev;
        return { width: newWidth, height: rect.height };
      });
    };

    // Medir al montar
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [cardVariant]);

  // Mapeo amigable para tipos de documento (SUNAT)
  const mapDocTypeLabel = (code: unknown) => {
    if (code === undefined || code === null) return "";
    const c = String(code);
    switch (c) {
      case "6":
        return "RUC";
      case "1":
        return "DNI";
      case "4":
        return "Carné de extranjería";
      case "7":
        return "Pasaporte";
      case "0":
        return "Otros";
      default:
        return c;
    }
  };

  const getValue = (row: T, key: ColumnKey<T>): string => {
    if (Array.isArray(key)) {
      return key
        .map((k) => {
          const fieldName = String(k);
          const raw = row[k];
          const v = raw !== undefined && raw !== null ? String(raw) : "";
          // Si el nombre del campo sugiere que es tipo de documento, mostrar etiqueta amigable
          if (/tipo\s*doc/i.test(fieldName) || /tipoDoc/i.test(fieldName)) {
            return mapDocTypeLabel(raw);
          }
          return v;
        })
        .filter((v) => v !== undefined && v !== null && v !== "")
        .join(" - ");
    }
    const fieldName = String(key as string);
    const value = row[key];
    // Si el nombre del campo sugiere que es tipo de documento, mostrar etiqueta amigable
    if (/tipo\s*doc/i.test(fieldName) || /tipoDoc/i.test(fieldName)) {
      return mapDocTypeLabel(value);
    }
    return value !== undefined && value !== null ? String(value) : "";
  };

  // --- Generador de rango de páginas dinámico ---
  const getPageNumbers = () => {
    if (!paginationInfo) return [1];
    const { page, totalPages } = paginationInfo;
    const pages: (number | string)[] = [];
    const range = 2;

    if (page > range + 1) pages.push(1, "...");
    for (
      let i = Math.max(1, page - range);
      i <= Math.min(totalPages, page + range);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - range) pages.push("...", totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  const cardStyle =
    cardVariant === "card"
      ? { width: containerSize.width }
      : cardVariant === "small"
      ? { width: "480px" }
      : { width: "100%" };

  return (
    <div id="containerTable" className="w-full" ref={containerRef}>
      <div className="mx-auto" style={cardStyle}>
        <Card>
          {nameTable && (
            <CardHeader>
              <CardTitle className="">
                Listado de {nameTable}{" "}
                {paginationInfo && `(${paginationInfo.total})`}
              </CardTitle>
            </CardHeader>
          )}

          <CardContent className=" p-2 md:p-5">
            {/* --- tabla  --- */}
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map(({ name, key, width }) => (
                      <TableHead
                        className={`bg-muted text-muted-foreground  ${
                          width ? width : " min-w-[100px] "
                        }`}
                        key={Array.isArray(key) ? key.join("_") : String(key)}
                      >
                        {name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasData ? (
                    data.map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((col) => {
                          const defaultValue = getValue(row, col.key);
                          const content =
                            renderCell?.(col, row, i) ?? defaultValue;
                          return (
                            <TableCell
                              key={
                                Array.isArray(col.key)
                                  ? col.key.join("_")
                                  : String(col.key)
                              }
                            >
                              {content}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-muted-foreground"
                      >
                        Sin resultados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* --- Paginación --- */}
            {paginationInfo && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  mt-5 mx-2">
                <div className="text-sm text-muted-foreground">
                  Página {paginationInfo.page} de {paginationInfo.totalPages}
                </div>
                <div className="flex gap-2 justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={
                            paginationInfo.page > 1
                              ? paginationPreviousPage
                              : undefined
                          }
                          className={
                            paginationInfo.page <= 1
                              ? "opacity-50 cursor-not-allowed "
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {pages.map((p, i) =>
                        p === "..." ? (
                          <PaginationItem key={i}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={p === paginationInfo.page}
                              onClick={() => paginationGoPage?.(p as number)}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={
                            paginationInfo.page < paginationInfo.totalPages
                              ? paginationNextPage
                              : undefined
                          }
                          className={
                            paginationInfo.page >= paginationInfo.totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
