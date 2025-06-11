
import { SidebarData } from "@/data/sidebar-data";
import { SidebarDataType } from "@/types/sidebar";
import { usePathname } from "next/navigation";

export const useBreadcrumb = () => {
    const pathname = usePathname();
    const breadcrumbs: string[] = [];
    let found = false;

    for (const section of SidebarData as SidebarDataType) {
        if (section.group) breadcrumbs.push(section.group);
        for (const item of section.items) {
            if (item.title) breadcrumbs.push(item.title);
            if (pathname.startsWith(item.url)) {
                found = true;
                break;
            } else if (item.items) {
                let checkSubItem = false;
                for (const subItem of item.items) {
                    if(pathname.startsWith(subItem.url)) {
                        breadcrumbs.push(subItem.title);
                        checkSubItem = true;
                        found = true;
                        break;
                    }
                }
                if (checkSubItem) break;
                else breadcrumbs.pop();
            } else {
                breadcrumbs.pop(); 
            }
        }
        if (found) break;
        if (section.group) breadcrumbs.pop();
    }


    return breadcrumbs;
};
