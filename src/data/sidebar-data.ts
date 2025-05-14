import { PATH } from "@/constants/paths";
import { SidebarDataType } from "@/types/sidebar";
import { Role } from "@/types/User";
import {
  LayoutDashboard,
  BarChart2,
  FileSignature,
  FileOutput,
  FileInput,
  FolderArchive,
  CheckSquare,
  FileText,
  Building,
  UserCog,
} from "lucide-react"


export const SidebarData: SidebarDataType = [
  {
    group: "Thống kê & báo cáo",
    roles: [Role.Admin, Role.Staff],
    items: [
      {
        title: "Dashboard",
        url: PATH.Dashboard,
        icon: LayoutDashboard,
        roles: [Role.Admin, Role.Staff],
      },
      {
        title: "Reports",
        url: PATH.Report,
        icon: BarChart2,
        roles: [Role.Admin],
      },
    ],
  },
  {
    group: "Quản lý văn bản đi - đến",
    roles: [Role.Admin, Role.Staff],
    items: [
      {
        title: "Ký duyệt",
        url: PATH.Dashboard,
        icon: FileSignature,
        roles: [Role.Admin, Role.Staff],
        isActive: true,
        items: [
          {
            title: "Ký duyệt văn bản",
            url: PATH.DocumentSign,
            roles: [Role.Admin, Role.Staff],
          },
          {
            title: "Nhật ký duyệt",
            url: PATH.DocumentHistory,
            roles: [Role.Admin, Role.Staff],
          },
        ],
      },
      {
        title: "Văn bản ngoài tổ chức",
        url: PATH.Dashboard,
        icon: FileOutput,
        roles: [Role.Admin, Role.Staff],
        isActive: true,
        items: [
          {
            title: "Văn bản đến",
            url: PATH.DocumentExternalIncoming,
            roles: [Role.Admin, Role.Staff],
          },
          {
            title: "Văn bản đi",
            url: PATH.DocumentExternalOutgoing,
            roles: [Role.Admin, Role.Staff],
          },
        ],
      },
      {
        title: "Văn bản nội bộ",
        url: PATH.Dashboard,
        icon: FileInput,
        roles: [Role.Admin, Role.Staff],
        isActive: true,
        items: [
          {
            title: "Nội bộ đến",
            url: PATH.DocumentInternalIncoming,
            roles: [Role.Admin, Role.Staff],
          },
          {
            title: "Nội bộ đi",
            url: PATH.DocumentInternalOutgoing,
            roles: [Role.Admin, Role.Staff],
          },
        ],
      },
    ],
  },
  {
    group: "Hệ thống - Quản lý các danh mục",
    isActive: true,
    roles: [Role.Admin],
    items: [
      {
        title: "Danh mục hồ sơ - vb",
        url: PATH.Dashboard,
        icon: FileText,
        roles: [Role.Admin],
        items: [
          {
            title: "Hạn bảo quản",
            url: PATH.SystemCategoryDocumentPeriod,
            roles: [Role.Admin],
          },
          {
            title: "Sổ đăng ký văn bản",
            url: PATH.SystemCategoryDocumentRegister,
            roles: [Role.Admin],
          },
          {
            title: "Loại văn bản",
            url: PATH.SystemCategoryDocumentCategory,
            roles: [Role.Admin],
          },
          {
            title: "Lĩnh vực",
            url: PATH.SystemCategoryDocumentField,
            roles: [Role.Admin],
          },
          {
            title: "Cơ quan ban hành",
            url: PATH.SystemCategoryDocumentOrganization,
            roles: [Role.Admin],
          },
        ],
      },
      {
        title: "Danh mục nơi lưu trữ",
        url: PATH.Dashboard,
        icon: FolderArchive,
        roles: [Role.Admin],
        items: [
          {
            title: "Danh mục hồ sơ",
            url: PATH.SystemCategoryStorageContainer,
            roles: [Role.Admin],
          },
          {
            title: "Danh mục kho lưu trữ",
            url: PATH.SystemCategoryStorageInventory,
            roles: [Role.Admin],
          },
          {
            title: "Danh mục kệ lưu trữ",
            url: PATH.SystemCategoryStorageSheft,
            roles: [Role.Admin],
          },
          {
            title: "Danh mục hộp lưu trữ",
            url: PATH.SystemCategoryStorageBox,
            roles: [Role.Admin],
          },
        ],
      },
      {
        title: "Phòng ban - chức vụ",
        url: PATH.Dashboard,
        icon: Building,
        roles: [Role.Admin],
        items: [
          {
            title: "Danh mục phòng ban",
            url: PATH.SystemCategoryDepartment,
            roles: [Role.Admin],
          },
          {
            title: "Danh mục chức vụ",
            url: PATH.SystemCategoryPosition,
            roles: [Role.Admin],
          },
          {
            title: "Danh mục nhóm người dùng",
            url: PATH.SystemCategoryGroup,
            roles: [Role.Admin],
          },
        ],
      },
    ],
  },
  {
    group: "Cấu hình & thiết lập",
    isActive: true,
    roles: [Role.Admin],
    items: [
      {
        title: "User & phân quyền",
        url: PATH.Dashboard,
        icon: UserCog,
        roles: [Role.Admin],
        items: [
          {
            title: "Danh sách user",
            url: PATH.SystemCategorySettingConfigUser,
            roles: [Role.Admin],
          },
          {
            title: "Phân quyền thao tác",
            url: PATH.SystemCategorySettingConfigUserRight,
            roles: [Role.Admin],
          },
        ],
      },
      {
        title: "Xét duyệt",
        url: PATH.Dashboard,
        icon: CheckSquare,
        roles: [Role.Admin],
        items: [
          {
            title: "Quy trình duyệt",
            url: PATH.SystemCategorySettingConfigConfirmProcess,
            roles: [Role.Admin],
          },
        ],
      },
    ],
  },
]



