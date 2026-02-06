"use client";

import * as React from "react";
import { Check, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "./ui/utils";

interface ComboboxProps {
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
  fetchSchools?: (q: string) => Promise<string[]>;
  onAddCustom?: (schoolName: string) => boolean | Promise<boolean>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
}

export function SchoolCombobox({
  items,
  value,
  onValueChange,
  fetchSchools,
  onAddCustom,
  placeholder = "Pilih kampus atau sekolah...",
  searchPlaceholder = "Cari kampus atau sekolah...",
  emptyMessage = "Kampus atau sekolah tidak ditemukan",
  disabled = false,
  error = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [remoteItems, setRemoteItems] = React.useState<string[] | null>(null);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customText, setCustomText] = React.useState("");
  const [addError, setAddError] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sourceItems = remoteItems ?? items;

  React.useEffect(() => {
    if (!fetchSchools) return;
    const q = searchValue.trim();
    const id = setTimeout(() => {
      if (!q) {
        setRemoteItems(null);
        return;
      }
      fetchSchools(q).then(list => setRemoteItems(list)).catch(() => setRemoteItems([]));
    }, 300);
    return () => clearTimeout(id);
  }, [searchValue, fetchSchools]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = open ? searchValue.trim().toLowerCase() : "";
    if (!q) return sourceItems;
    return sourceItems.filter(s => s.toLowerCase().includes(q));
  }, [sourceItems, searchValue, open]);

  const handleSelect = (item: string) => {
    onValueChange(item);
    setOpen(false);
    setSearchValue("");
    setRemoteItems(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setSearchValue("");
    setRemoteItems(null);
  };

  const handleAddCustom = async () => {
    const trim = customText.trim();
    if (!trim) return;
    setAddError("");
    try {
      const res = onAddCustom ? await onAddCustom(trim) : true;
      const added = typeof res === 'boolean' ? res : Boolean(res);
      if (!added) {
        setAddError('Nama sudah ada di daftar');
        return;
      }
      setCustomText("");
      setShowCustomInput(false);
      handleSelect(trim);
    } catch (err) {
      setAddError('Gagal menambahkan sekolah');
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md border bg-white cursor-pointer transition-colors",
          error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
          disabled && "bg-gray-50 cursor-not-allowed opacity-50",
          open && "border-blue-500 ring-2 ring-blue-200"
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <input
          type="text"
          placeholder={open ? searchPlaceholder : placeholder}
          value={open ? searchValue : value || ""}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400 disabled:cursor-not-allowed"
          disabled={disabled}
          autoComplete="off"
        />
        {value && !open && (
          <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded" title="Hapus pilihan">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", open && "rotate-180")} />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {showCustomInput ? (
            <div className="p-3 border-b space-y-2">
              <label className="text-sm font-medium">Tambah Sekolah / Kampus Baru</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama sekolah/kampus"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAddCustom}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  disabled={!customText.trim()}
                >
                  Tambah
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomText("");
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {addError ? (
                <div className="text-sm text-red-500 mt-1">{addError}</div>
              ) : null}
            </div>
          ) : null}

          <div className="max-h-[300px] flex flex-col">
            {filtered.length === 0 && !showCustomInput ? (
              <div className="px-3 py-2 text-sm text-gray-500">{emptyMessage}</div>
            ) : (
              <ul className="max-h-[260px] overflow-y-auto">
                {filtered.map(item => (
                  <li
                    key={item}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm",
                      value === item && "bg-blue-100 text-blue-900"
                    )}
                  >
                    <Check className={cn("w-4 h-4", value === item ? "opacity-100" : "opacity-0")} />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Footer: Lainnya / Input Manual di luar list scrollable */}
            <div className="border-t px-3 py-2">
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left text-blue-600 flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <Plus className="w-4 h-4" />
                  Lainnya / Input Manual
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}