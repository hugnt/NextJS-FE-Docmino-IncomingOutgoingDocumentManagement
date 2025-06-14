import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Onboarding() {
  return (
    <div className="font-sans bg-white flex flex-col min-h-screen w-full">
      <div>
        <div className="bg-gray-200 px-4 py-4">
          <div className="w-full md:max-w-6xl md:mx-auto md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <Image src="/images/logo.png" alt="Docmino" width={32} height={32} className="mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Docmino
              </span>
            </div>
            <div>
              <div className="hidden md:block">
                <span className="inline-block py-1 md:py-4 text-gray-600 mr-6 font-bold">Văn bản đến</span>
                <span className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-600 mr-6">Văn bản đi</span>
                <span className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-600 mr-6">Văn bản nội bộ</span>
                <span className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-600 mr-6">Lưu trữ</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Link href="/login">
                <Button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">Đăng nhập</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 md:overflow-hidden">
          <div className="px-4 py-16">
            <div className="relative w-full md:max-w-2xl md:mx-auto text-center">
              <h1 className="font-bold text-gray-700 text-xl sm:text-2xl md:text-5xl leading-tight mb-6">
                Hệ thống quản lý văn bản điện tử toàn diện
              </h1>
              <p className="text-gray-600 md:text-xl md:px-18">
                Quản lý văn bản đến, đi và nội bộ theo quy trình chuẩn, minh bạch và bảo mật
              </p>
              <div className="hidden md:block h-40 w-40 rounded-full bg-blue-600 absolute right-0 bottom-0 -mb-64 -mr-48" />
              <div className="hidden md:block h-5 w-5 rounded-full bg-yellow-500 absolute top-0 right-0 -mr-40 mt-32" />
            </div>
          </div>
          <svg
            className="fill-current bg-gray-200 text-white hidden md:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fillOpacity={1}
              d="M0,64L120,85.3C240,107,480,149,720,149.3C960,149,1200,107,1320,85.3L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
            />
          </svg>
        </div>
        <div
          className="max-w-4xl mx-auto bg-white shadow-lg relative z-20 hidden md:block"
          style={{ marginTop: "-320px", borderRadius: 20 }}
        >
          <div
            className="h-20 w-20 rounded-full bg-yellow-500 absolute top-0 left-0 -ml-10 -mt-10"
            style={{ zIndex: -1 }}
          />
          <div className="h-5 w-5 rounded-full bg-blue-500 absolute top-0 left-0 -ml-32 mt-12" style={{ zIndex: -1 }} />
          <div className="h-10 bg-white rounded-t-lg border-b border-gray-100" />
          <div className="flex" style={{ height: 550 }}>
            <div className="w-32 bg-gray-200 p-6 overflow-hidden rounded-bl-lg">
              <div className="text-center mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-600 mb-4 mx-auto" />
                <div className="h-2 rounded-full bg-blue-600" />
              </div>
              <div className="text-center mb-10">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 mx-auto" />
                <div className="h-2 rounded-full bg-gray-300" />
              </div>
              <div className="text-center mb-10">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 mx-auto" />
                <div className="h-2 rounded-full bg-gray-300" />
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 mx-auto" />
                <div className="h-2 rounded-full bg-gray-300" />
              </div>
            </div>
            <div className="flex-1 py-6 px-8">
              <div className="flex flex-wrap -mx-4">
                <div className="w-2/3 px-4">
                  <div className="flex flex-wrap -mx-4 mb-10">
                    <div className="w-1/4 px-4">
                      <div className="text-center mb-10 bg-white shadow rounded-lg p-6">
                        <div className="w-10 h-10 rounded-full bg-green-600 mb-4 mx-auto" />
                        <div className="h-2 rounded-full bg-gray-200" />
                      </div>
                    </div>
                    <div className="w-1/4 px-4">
                      <div className="text-center mb-10 bg-white shadow rounded-lg p-6">
                        <div className="w-10 h-10 rounded-full bg-blue-600 mb-4 mx-auto" />
                        <div className="h-2 rounded-full bg-gray-200" />
                      </div>
                    </div>
                    <div className="w-1/4 px-4">
                      <div className="text-center mb-10 bg-white shadow rounded-lg p-6">
                        <div className="w-10 h-10 rounded-full bg-orange-400 mb-4 mx-auto" />
                        <div className="h-2 rounded-full bg-gray-200" />
                      </div>
                    </div>
                    <div className="w-1/4 px-4">
                      <div className="text-center mb-10 bg-white shadow rounded-lg p-6">
                        <div className="w-10 h-10 rounded-full bg-blue-800 mb-4 mx-auto" />
                        <div className="h-2 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </div>
                  <div className="h-32 percentage mb-10 pt-2">
                    <div className="h-4 bg-gray-200 w-64 mb-4 block" />
                    <div className="h-4 bg-gray-200 w-32 mb-4 block" />
                    <div className="h-4 bg-gray-200 w-40 mb-4 block" />
                    <div className="h-4 bg-gray-200 w-20 mb-4 block" />
                  </div>
                  <div className="w-full flex flex-wrap mb-6">
                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-4" />
                        <div>
                          <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                          <div className="h-2 w-10 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-4" />
                        <div>
                          <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                          <div className="h-2 w-10 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap">
                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-4" />
                        <div>
                          <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                          <div className="h-2 w-10 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-4" />
                        <div>
                          <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                          <div className="h-2 w-10 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 px-4">
                  <div className="rounded-lg shadow-lg p-6">
                    <div className="block w-12 h-2 rounded-full bg-gray-200 mb-6" />
                    <svg height={150} width={150} viewBox="0 0 20 20" className="mx-auto mb-12">
                      <circle r={10} cx={10} cy={10} fill="#3b82f6" />
                      <circle
                        r={5}
                        cx={10}
                        cy={10}
                        fill="transparent"
                        stroke="#1d4ed8"
                        strokeWidth={10}
                        strokeDasharray="11 31.4"
                        transform="rotate(-90) translate(-20)"
                      />
                    </svg>
                    <div className="flex flex-wrap -mx-2 mb-10">
                      <div className="w-1/3 px-2">
                        <div className="block h-2 rounded-full bg-gray-200" />
                      </div>
                      <div className="w-1/3 px-2">
                        <div className="block h-2 rounded-full bg-gray-200" />
                      </div>
                      <div className="w-1/3 px-2">
                        <div className="block h-2 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between my-10">
                    <div>
                      <div className="h-2 w-10 bg-gray-300 rounded-full mb-2" />
                      <div className="h-2 w-16 bg-gray-300 rounded-full mb-2" />
                      <div className="h-2 w-8 bg-gray-300 rounded-full" />
                    </div>
                    <div>
                      <div className="ml-auto h-2 w-5 bg-gray-300 rounded-full mb-2" />
                      <div className="ml-auto h-2 w-6 bg-gray-300 rounded-full mb-2" />
                      <div className="ml-auto h-2 w-8 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                  <div className="text-right flex justify-end">
                    <div className="rounded-lg h-8 w-20 px-4 bg-gray-200 mr-2" />
                    <div className="rounded-lg h-8 w-20 px-4 bg-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 md:hidden">
          <div className="-mt-10 max-w-4xl mx-auto bg-white shadow-lg relative z-20" style={{ borderRadius: 20 }}>
            <div className="h-10 bg-white rounded-t-lg border-b border-gray-100" />
            <div className="flex" style={{ height: 340 }}>
              <div className="w-16 bg-gray-200 px-2 py-6 overflow-hidden rounded-bl-lg">
                <div className="text-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-blue-600 mb-2 mx-auto" />
                  <div className="h-2 w-8 mx-auto rounded-full bg-blue-600" />
                </div>
                <div className="text-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-gray-300 mb-2 mx-auto" />
                  <div className="h-2 w-8 mx-auto rounded-full bg-gray-300" />
                </div>
                <div className="text-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-gray-300 mb-2 mx-auto" />
                  <div className="h-2 w-8 mx-auto rounded-full bg-gray-300" />
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-gray-300 mb-2 mx-auto" />
                  <div className="h-2 w-8 mx-auto rounded-full bg-gray-300" />
                </div>
              </div>
              <div className="flex-1 py-6 px-4">
                <div className="flex flex-wrap -mx-2">
                  <div className="w-1/3 px-2">
                    <div className="text-center mb-6 bg-white shadow rounded-lg px-2 py-3">
                      <div className="w-4 h-4 rounded-full bg-green-600 mb-2 mx-auto" />
                      <div className="h-2 w-8 mx-auto rounded-full bg-gray-200" />
                    </div>
                  </div>
                  <div className="w-1/3 px-2">
                    <div className="text-center mb-6 bg-white shadow rounded-lg px-2 py-3">
                      <div className="w-4 h-4 rounded-full bg-blue-600 mb-2 mx-auto" />
                      <div className="h-2 w-8 mx-auto rounded-full bg-gray-200" />
                    </div>
                  </div>
                  <div className="w-1/3 px-2">
                    <div className="text-center mb-6 bg-white shadow rounded-lg px-2 py-3">
                      <div className="w-4 h-4 rounded-full bg-orange-600 mb-2 mx-auto" />
                      <div className="h-2 w-8 mx-auto rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-2 mb-6">
                  <div className="w-1/2 px-2">
                    <div className="shadow h-24 p-2 rounded-lg">
                      <div className="h-20 percentage pt-2">
                        <div className="h-2 bg-gray-200 w-24 mb-2 block" />
                        <div className="h-2 bg-gray-200 w-12 mb-2 block" />
                        <div className="h-2 bg-gray-200 w-20 mb-2 block" />
                        <div className="h-2 bg-gray-200 w-8 mb-2 block" />
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 px-2">
                    <div className="rounded-lg shadow px-2 py-2">
                      <div className="block w-8 h-2 rounded-full bg-gray-200 mb-2" />
                      <div className="mb-2">
                        <svg height={50} width={50} viewBox="0 0 20 20" className="mx-auto">
                          <circle r={10} cx={10} cy={10} fill="#3b82f6" />
                          <circle
                            r={5}
                            cx={10}
                            cy={10}
                            fill="transparent"
                            stroke="#1d4ed8"
                            strokeWidth={10}
                            strokeDasharray="11 31.4"
                            transform="rotate(-90) translate(-20)"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-wrap -mx-2">
                        <div className="w-1/3 px-2">
                          <div className="block h-2 rounded-full bg-gray-200" />
                        </div>
                        <div className="w-1/3 px-2">
                          <div className="block h-2 rounded-full bg-gray-200" />
                        </div>
                        <div className="w-1/3 px-2">
                          <div className="block h-2 rounded-full bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-wrap mb-2">
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 mr-4" />
                      <div>
                        <div className="h-2 w-10 bg-gray-200 mb-1 rounded-full" />
                        <div className="h-2 w-6 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 mr-4" />
                      <div>
                        <div className="h-2 w-10 bg-gray-200 mb-1 rounded-full" />
                        <div className="h-2 w-6 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-wrap mb-6">
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 mr-4" />
                      <div>
                        <div className="h-2 w-10 bg-gray-200 mb-1 rounded-full" />
                        <div className="h-2 w-6 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 mr-4" />
                      <div>
                        <div className="h-2 w-10 bg-gray-200 mb-1 rounded-full" />
                        <div className="h-2 w-6 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex justify-end">
                  <div className="rounded-lg h-6 w-16 px-4 bg-gray-200 mr-2" />
                  <div className="rounded-lg h-6 w-16 px-4 bg-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-700 mb-4">Tính năng nổi bật</h2>
              <p className="text-gray-600 text-lg">Hệ thống quản lý văn bản tuân thủ Nghị định 30/2020/NĐ-CP</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Quản lý toàn diện</h3>
                <p className="text-gray-600">Xử lý văn bản đến, đi và nội bộ theo quy trình chuẩn</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Phê duyệt đa cấp</h3>
                <p className="text-gray-600">Hỗ trợ quy trình phê duyệt linh hoạt theo cơ cấu tổ chức</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Lưu trữ an toàn</h3>
                <p className="text-gray-600">Bảo mật và lưu trữ văn bản theo tiêu chuẩn quốc gia</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center p-4 text-gray-600 mt-10">
          Được phát triển bởi
          <a
            className="border-b text-blue-500 ml-1"
            href="https://www.facebook.com/hugnt.vn/"
            target="_blank"
            rel="noreferrer"
          >
            @DocFlow Devteam
          </a>
        </p>
      </div>
    </div>
  )
}
