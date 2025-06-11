import { PATH } from "@/constants/paths";
import { SidebarDataType } from "@/types/sidebar";
import { AllRoles, Role } from "@/types/User";
import {
  BarChart2,
  Building,
  FileInput,
  FileOutput,
  FileSignature,
  FileText,
  FolderArchive,
  LayoutDashboard,
  UserCog
} from "lucide-react";


export const SidebarData: SidebarDataType = [
  {
    group: "Thống kê & báo cáo",
    roles: [Role.Admin, Role.ClericalAssistant],
    items: [
      {
        title: "Dashboard",
        url: PATH.Dashboard,
        icon: LayoutDashboard,
        roles: [Role.Admin, Role.ClericalAssistant],
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
    roles: AllRoles,
    items: [
      {
        title: "Ký duyệt",
        url: PATH.Dashboard,
        icon: FileSignature,
        roles: [Role.Approver],
        isActive: true,
        items: [
          {
            title: "Ký duyệt văn bản",
            url: PATH.DocumentSign,
            roles: [Role.Approver],
          },
          {
            title: "Nhật ký duyệt",
            url: PATH.DocumentHistory,
            roles: [Role.Approver],
          },
        ],
      },
      {
        title: "Văn bản ngoài tổ chức",
        url: PATH.Dashboard,
        icon: FileOutput,
        roles: [Role.Admin, Role.ClericalAssistant],
        isActive: true,
        items: [
          {
            title: "Văn bản đến",
            url: PATH.DocumentExternalIncoming,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Văn bản đi",
            url: PATH.DocumentExternalOutgoing,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
        ],
      },
      {
        title: "Văn bản nội bộ",
        url: PATH.Dashboard,
        icon: FileInput,
        roles: [Role.Admin, Role.ClericalAssistant],
        isActive: true,
        items: [
          {
            title: "Nội bộ đến",
            url: PATH.DocumentInternalIncoming,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Nội bộ đi",
            url: PATH.DocumentInternalOutgoing,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
        ],
      },
    ],
  },
  {
    group: "Hệ thống - Quản lý các danh mục",
    isActive: true,
    roles: [Role.Admin, Role.ClericalAssistant],
    items: [
      {
        title: "Danh mục hồ sơ - vb",
        url: PATH.Dashboard,
        icon: FileText,
        roles: [Role.Admin, Role.ClericalAssistant],
        items: [
          {
            title: "Hạn bảo quản",
            url: PATH.SystemCategoryDocumentPeriod,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Sổ đăng ký văn bản",
            url: PATH.SystemCategoryDocumentRegister,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Loại văn bản",
            url: PATH.SystemCategoryDocumentCategory,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Lĩnh vực",
            url: PATH.SystemCategoryDocumentField,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Cơ quan ban hành",
            url: PATH.SystemCategoryDocumentOrganization,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
        ],
      },
      {
        title: "Danh mục nơi lưu trữ",
        url: PATH.Dashboard,
        icon: FolderArchive,
        roles: [Role.Admin, Role.ClericalAssistant],
        items: [
          {
            title: "Danh mục hồ sơ",
            url: PATH.SystemCategoryStorageDossier,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Danh mục kho lưu trữ",
            url: PATH.SystemCategoryStorageInventory,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Danh mục kệ lưu trữ",
            url: PATH.SystemCategoryStorageSheft,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Danh mục hộp lưu trữ",
            url: PATH.SystemCategoryStorageBox,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
        ],
      },
      {
        title: "Phòng ban - chức vụ",
        url: PATH.Dashboard,
        icon: Building,
        roles: [Role.Admin, Role.ClericalAssistant],
        items: [
          {
            title: "Danh mục phòng ban",
            url: PATH.SystemCategoryDepartment,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Danh mục chức vụ",
            url: PATH.SystemCategoryPosition,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
          {
            title: "Danh mục nhóm người dùng",
            url: PATH.SystemCategoryGroup,
            roles: [Role.Admin, Role.ClericalAssistant],
          },
        ],
      },
    ],
  },
  {
    group: "Tài khoản & phân quyền",
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
    ],
  },
]



