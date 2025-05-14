import { LucideIcon } from "lucide-react"
import { Role } from "./User"

// Base menu item type
export interface BaseMenuItem {
    title: string
    url: string
    icon?: LucideIcon
    roles: Role[]
    isActive?: boolean
}

// Menu item that can have sub-items
export interface MenuItem extends BaseMenuItem {
    items?: BaseMenuItem[]
}

// Sidebar section type
export interface SidebarSection {
    group: string
    isActive?: boolean
    roles: Role[]
    items: MenuItem[]
}

// The full sidebar data type
export type SidebarDataType = SidebarSection[]
