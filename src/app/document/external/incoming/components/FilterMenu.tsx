/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ExternalDocumentFilter } from "@/types/ExternalDocument"
import { DocumentStatus } from "@/types/Document"
import { useDocumentContext } from "@/context/documentContext"

type FilterItem<T = any> = {
  id: T
  label: string
  checked?: boolean
}


type FilterSection = {
  id: string
  title: string
  defaultOpen?: boolean
  items?: FilterItem[]
}
interface FilterMenuProps {
  onOpenChange?: (open: boolean) => void,
  className?: string,
  filter?: ExternalDocumentFilter,
  setFilter?: (filter: ExternalDocumentFilter) => void
}
export default function FilterMenu({ onOpenChange, className, filter, setFilter }: FilterMenuProps) {
  const { arrivalDates, categories, fields, documentRegisters, documentStatus } = useDocumentContext();
  const [isOpen, setIsOpen] = useState(true)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "loai-van-ban": true,
    "tinh-trang-xu-ly": true,
    "theo-so-dang-ky": true,
  })

  const [sections, setSections] = useState<FilterSection[]>([])

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const filterSections: FilterSection[] = [];
    filterSections.push({
      id: "arrivalDates",
      title: "Ngày đến",
      defaultOpen: false,
      items: arrivalDates?.map(x => ({ id: x, label: formatDate(x), checked: false }))
    })

    filterSections.push({
      id: "categories",
      title: "Loại văn bản",
      defaultOpen: false,
      items: categories?.map(x => ({ id: x.key, label: x.value, checked: false }))
    })

    filterSections.push({
      id: "fields",
      title: "Lĩnh vực",
      defaultOpen: false,
      items: fields?.map(x => ({ id: x.key, label: x.value, checked: false }))
    })

    filterSections.push({
      id: "documentStatus",
      title: "Trạng thái xử lý",
      defaultOpen: false,
      items: documentStatus?.map(x => ({ id: x.key, label: x.value, checked: false }))
    })

    filterSections.push({
      id: "documentRegisters",
      title: "Theo sổ đăng ký văn bản",
      defaultOpen: false,
      items: documentRegisters?.map(x => ({ id: x.key, label: x.value, checked: false }))
    })

    setSections(filterSections);
  }, [arrivalDates,categories,fields,documentStatus,documentRegisters])

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  const handleCheckboxChange = (sectionId: string, itemId: string) => {
    const key = `${sectionId}-${itemId}`
    setCheckedItems((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      }
      // Calculate new total active filters
      const newTotal = Object.values(updated).filter(Boolean).length
      if (newTotal === 0) {
        clearAllFilters()
      }
      return updated
    })
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const getActiveFiltersCount = (section: FilterSection) => {
    if (!section.items) return 0
    return section.items.filter((item) => checkedItems[`${section.id}-${item.id}`]).length
  }

  const clearAllFilters = () => {
    setCheckedItems({})
    const emptyValue = {
      arrivalDates: [],
      categories: [],
      fields: [],
      documentStatus: [],
      documentRegisters: [],
    }
    if (setFilter && filter) {
      setFilter({ ...filter, ...emptyValue });
    }
  }

  const getCheckedValues = () => {
    const getCheckedIds = (sectionId: string): any[] => {
      const section = sections.find(s => s.id === sectionId);
      if (!section || !section.items) return [];
      return section.items
        .filter(item => checkedItems[`${sectionId}-${item.id}`])
        .map(item => item.id);
    };
    return {
      arrivalDates: getCheckedIds("arrivalDates") as string[],
      categories: getCheckedIds("categories") as number[],
      fields: getCheckedIds("fields") as number[],
      documentStatus: getCheckedIds("documentStatus") as DocumentStatus[],
      documentRegisters: getCheckedIds("documentRegisters") as string[],
    };
  };

  const handleApply = () => {
    const checkedValues = getCheckedValues();
    console.log("Checked values:", checkedValues);
    if (setFilter && filter) {
      setFilter({ ...filter, ...checkedValues });
    }
  };

  const totalActiveFilters = sections.reduce((count, section) => count + getActiveFiltersCount(section), 0)

  return (
    <div className={cn("bg-white border rounded-md shadow-sm overflow-hidden h-full", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className={cn("w-full", className)}>
          <div className="py-2 px-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-white cursor-pointer">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Lọc theo loại</span>
            </div>
            <div className="flex items-center gap-1">
              {totalActiveFilters > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 mr-1">
                  {totalActiveFilters}
                </Badge>
              )}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="p-3 pt-2 overflow-y-auto">
            {totalActiveFilters > 0 && (
              <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-8 my-2">
                Áp dụng ({totalActiveFilters})
              </Button>
            )}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">Phân loại văn bản đến</p>
              {totalActiveFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2"
                  onClick={clearAllFilters}
                >
                  Xóa tất cả
                </Button>
              )}
            </div>

            <div className="space-y-0.5">
              {sections.map((section) => (
                <Collapsible
                  key={section.id}
                  open={openSections[section.id]}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between py-2 px-2 w-full text-left rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      {openSections[section.id] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0 transition-transform" />
                      )}
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    {getActiveFiltersCount(section) > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {getActiveFiltersCount(section)}
                      </Badge>
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pl-6 space-y-1.5 py-1.5">
                      {section.items && section.items.length > 0 ? (
                        section.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 group">
                            <Checkbox
                              id={`${section.id}-${item.id}`}
                              checked={checkedItems[`${section.id}-${item.id}`] || false}
                              onCheckedChange={() => handleCheckboxChange(section.id, item.id)}
                              className="h-3.5 w-3.5 rounded-sm border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                              htmlFor={`${section.id}-${item.id}`}
                              className={cn(
                                "text-sm cursor-pointer group-hover:text-blue-600 transition-colors",
                                checkedItems[`${section.id}-${item.id}`] && "text-blue-600 font-medium",
                              )}
                            >
                              {item.label}
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="py-2 text-xs text-gray-500 italic">Không có mục nào</div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>


        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
