"use client";

import statisticRequest from "@/api/statisticRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDocument, Statistic } from "@/types/Statistic";
import {
  Archive,
  Calendar,
  FileInput,
  FileOutput,
  FileText
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { DocumentStatusChart } from "./components/DocumentStatusChart";

const iconsList = [
  <FileInput key="file-input" className="h-4 w-4 text-blue-600" />,
  <FileOutput key="file-output" className="h-4 w-4 text-green-600" />,
  <FileText key="file-text" className="h-4 w-4 text-purple-600" />,
  <Archive key="archive" className="h-4 w-4 text-gray-600" />
]
const colorsList = [
  "#3b82f6", // blue
  "#10b981", // green
  "#ef4444", // red
  "#f59e0b", // yellow
];

export default function DashboardPage() {
  const [entityCounterData, setEntityCounterData] = useState<Statistic[]>([])
  const [statusCounterData, setStatusCounterData] = useState<Statistic[]>([])
  const [monthlyDocumentData, setMonthlyDocumentData] = useState<MonthlyDocument[]>([])

  useEffect(() => {
    statisticRequest.getEntityCounters().then(res => {
      for (let i = 0; i < res.data!.length; i++) {
        res.data![i].icon = iconsList[i]
      }
      setEntityCounterData(res.data!)
    })

    statisticRequest.getDocumentStatusCounters().then(res => {
      for (let i = 0; i < res.data!.length; i++) {
        res.data![i].fill = colorsList[i]
      }
      setStatusCounterData(res.data!)
    })

    statisticRequest.getMonthlyDocumentStatistics().then(res => {
      setMonthlyDocumentData(res.data!)
    })
   
  }, [])
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Thống kê hôm nay</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {entityCounterData.map(x => <Card key={x.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{x.title}</CardTitle>
                {x.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{x.total}</div>
              <p className="text-xs text-muted-foreground">{x.subContent}</p>
            </CardContent>
          </Card>)}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Thống kê văn bản theo tháng</CardTitle>
              <CardDescription>Số lượng văn bản đến, đi và nội bộ trong 6 tháng gần nhất</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyDocumentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar name={"Văn bản đến"} dataKey="incomingDocumentCount" fill="#3b82f6" />
                  <Bar name={"Văn bản đi"} dataKey="outgoingDocumentCount" fill="#10b981" />
                  <Bar name={"Văn bản nội bộ"} dataKey="internalDocumentCount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Trạng thái văn bản</CardTitle>
              <CardDescription>Phân bố trạng thái văn bản hiện tại</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
             <DocumentStatusChart data={statusCounterData} />
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  )
}
