/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from '@/components/input/DatePicker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea';
import { useDocumentContext } from '@/context/documentContext';
import { InternalDocumentDetail } from '@/types/InternalDocument';

import React from 'react'
import { UseFormReturn } from 'react-hook-form';

interface GeneralInformationFormProps {
  form: UseFormReturn<InternalDocumentDetail, any, InternalDocumentDetail>,
  readOnly?: boolean
}
export default function GeneralInformationForm(props: GeneralInformationFormProps) {
  const { form, readOnly = false } = props;
  const {
    documentRegisters,
    categories,
    fields,
    organizations,
    securePriorities,
    urgentPriorities,
    documentStatus
  } = useDocumentContext();
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="documentRegisterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sổ đăng ký văn bản
                <span className="text-red-500">(*)</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}>
                <FormControl className="w-full">
                  <SelectTrigger disabled={readOnly}>
                    <SelectValue placeholder="Chọn sổ đăng ký văn bản" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    documentRegisters?.map(x => {
                      return <SelectItem key={x.key} value={x.key}>{x.value}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Tên văn bản
                <span className="text-red-500">(*)</span>
              </FormLabel>
              <FormControl>
                <Input readOnly={readOnly} {...field} placeholder='Nhập tên văn bản' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">

          <FormField
            control={form.control}
            name='issuedDate'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Ngày văn bản</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={"Chọn ngày văn bản"}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='codeNotation'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>
                Số, ký hiệu
                <span className="text-red-500">(*)</span>
              </FormLabel>
              <FormControl>
                <Input readOnly={readOnly} {...field} placeholder='[Số thứ tự]/[Chữ viết tắt cơ quan ban hành]–[viết tắt loại văn bản]' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại văn bản
                <span className="text-red-500">(*)</span>
              </FormLabel>
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={val => field.onChange(Number(val))}>
                <FormControl className="w-full">
                  <SelectTrigger disabled={readOnly}>
                    <SelectValue placeholder="Chọn loại văn bản" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  {
                    categories?.map(x => {
                      return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fieldId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lĩnh vực
                <span className="text-red-500">(*)</span>
              </FormLabel>
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={val => field.onChange(Number(val))}>
                <FormControl className="w-full">
                  <SelectTrigger disabled={readOnly}>
                    <SelectValue placeholder="Chọn lĩnh vực cho văn bản" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  {
                    fields?.map(x => {
                      return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị soạn</FormLabel>
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={val => field.onChange(Number(val))}>
                <FormControl className="w-full">
                  <SelectTrigger disabled={readOnly}>
                    <SelectValue placeholder="Chọn cơ quan nhận văn bản" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  {
                    organizations?.map(x => {
                      return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <div className="grid  grid-cols-3  gap-3">
          <FormField
            control={form.control}
            name="securePriority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Độ mật</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  defaultValue={"0"}
                  onValueChange={val => field.onChange(Number(val))}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={readOnly}>
                      <SelectValue placeholder="Chọn độ mật" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {
                      securePriorities?.map(x => {
                        return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="urgentPriority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Độ khẩn</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  defaultValue={"0"}
                  onValueChange={val => field.onChange(Number(val))}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={readOnly}>
                      <SelectValue placeholder="Chọn độ khẩn" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {
                      urgentPriorities?.map(x => {
                        return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  defaultValue={"0"}
                  onValueChange={val => field.onChange(Number(val))}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={readOnly}>
                      <SelectValue placeholder="Trạng thái xử lý" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {
                      documentStatus?.map(x => {
                        return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name='pageAmount'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Số trang</FormLabel>
                <FormControl>
                  <Input readOnly={readOnly} type="number" {...field} placeholder='Nhập số tờ' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='issuedAmount'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Số bản</FormLabel>
                <FormControl>
                  <Input readOnly={readOnly} type="number" {...field} placeholder='Nhập số bản' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
          <div></div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='space-y-1 col-span-3'>
                <FormLabel>Trích yếu nội dung</FormLabel>
                <FormControl>
                  <Textarea readOnly={readOnly} className="min-h-auto" {...field} placeholder='Nhập trích yếu nội dung' rows={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
