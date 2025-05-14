
import { SidebarData } from "@/data/sidebar-data";
import { usePathname } from "next/navigation";

export const useBreadcrumb = () => {
    const pathname = usePathname(); // Get the current path
    const breadcrumbs: string[] = [];

    for (const item of SidebarData) {
        const itemUrl = item.url || "";
        if (!itemUrl) continue;
        if (pathname.startsWith(itemUrl)) {
            breadcrumbs.push(item.title);

            if (item.items) {
                for (const subItem of item.items) {
                    const subItemUrl = subItem.url
                        ? `${itemUrl}${subItem.url.startsWith("/") ? subItem.url : "/" + subItem.url}`
                        : itemUrl;
                    if (pathname === subItemUrl) {
                        breadcrumbs.push(subItem.title);
                    }
                }
            }
        }
    }

    return breadcrumbs;
};
