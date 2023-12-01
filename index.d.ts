import type {
  Prisma, User
} from '@prisma/client'
import type { RouteLocationNamedRaw } from 'vue-router'
import type { FormItemRule } from 'element-plus'
import {DateTime} from "next-auth/providers/kakao";
export type AppUser = User
export type NotifyGet = {id?: number, message: string, createdAt: Date, sender: {profile: {name: string, family: string} | null} | null, recipients?: {read: boolean, readAt: Date | null}[]}

export interface MenuItem {
  label: string,
  icon?: string,
  route?: RouteLocationNamedRaw,
  permissions?: string[]
  items?: MenuItem[]
}
declare module 'next-auth'{
  interface User {
    name: AppUser
  }
}
export type Awaitable<T> = T | PromiseLike<T>
export type AppLevel = 'system'|'company'|'user'
export type Can = (permission: string, level?: AppLevel | AppLevel[]) => boolean
export type AppUserWithPermissionFn = AppUser & { role: string, can: Can }
declare module 'h3'{
  interface H3EventContext {
    user: AppUserWithPermissionFn
  }
}
export type AppFormFieldsValue = string | number | boolean | Date | object | null | undefined | any[]
export type AppFormFields = {
  [x:string|symbol]: {
    label: string
    icon?: string
    value?: AppFormFieldsValue
    type?: string
    hint?: string
    options?: any
    props?: object
    rule?: FormItemRule | FormItemRule[]
    group?: AppFormFields
  }
}
export type AppFormFieldsRecord = AppFormFields[typeof AppFormFields]
export type AppFormData = {[P in keyof AppFormFields]:AppFormFieldsValue}
export interface Loadings {
  [key: number]: boolean
}
export interface PriorityTagType extends Record<ItemPriority, 'info' | 'warning' | 'danger' | ''> {}

type calendarType = 'jalali' | 'gregory'
declare module 'dayjs' {
  interface Dayjs {
    calendar(calendarType: calendarType): Dayjs
    isJalali(): boolean
  }
}
declare module '@prisma/client' {
  interface Prisma {
    JsonValue: Prisma.JsonValue & { ids: string[], groups: string[] }
  }
}

export interface Exception {
  user: { name: string, family: string }
  as: string
  desc: string
  requestedAt: Date
}
export interface Filters {
  id?: string
  code?: string,
  createdAt: string
}
export interface ConsumeFilters extends Filters  {
  consumedAt?: string
  consumed?:string
}
export interface ConsumedFilters extends Filters {
  consumedAt: string
  consumeConfirmedAt: string
  consumeConfirmed: string
}

export interface Permission {
  name: string
  slug: string
}

export {}
