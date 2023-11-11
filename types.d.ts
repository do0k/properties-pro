import type {
  Stuff,
  Person,
  ItemPriority,
  PayItemStatus,
  Prisma,
  SecurityLog,
  Cargo,
  CargoStuffs,
  Truck, TruckDriver, CargoConfirm, TruckOwner
} from '@prisma/client'
import type { RouteLocationNamedRaw } from 'vue-router'
import type { FormItemRule } from 'element-plus'
import 'nuxt-socket-io/io/types.d'
import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import {DateTime} from "next-auth/providers/kakao";
export type AppUser = {id: number, username: string, email: string, password?: string, active: boolean, socket: Prisma.JsonValue & {ids?:string[], groups?:string[]}, profile: {name: string, family: string, gender: string, code: string, brith: Date | null, born: string} | null, roles: { role:{ id:number, name:string }}[], companies: { companyId: number}[]} | null
export type _SecLog = {id: number, createdAt: Date,user:{id:number, profile: {name:string, family:string}}, cargo: (Cargo & {details: JsonValue & { scale: string }, logs: SecurityLog[], truck: Truck & { drivers: {person: Person}[], owners: {person: Person}[]} | null, stuffs: {stuff:Stuff}[] }), truck: Truck, person: Person | null}
export type PayListGet = {id: number, name: string, items: {id: number, amount: string, details: string | null, priority: ItemPriority, dueAt: Date, payOrder: number, status: PayItemStatus, customer: {}}[]} | null
export type StuffGet = {id: number, code: string, name: string, options: Prisma.JsonValue & {acceptations: {name: string, from: string, to: string}[]}, description: string, createdAt: Date, group: {id: number, name: string, slug: string}}
export type NotifyGet = {id?: number, message: string, createdAt: Date, sender: {profile: {name: string, family: string} | null} | null, recipients?: {read: boolean, readAt: Date | null}[]}
export type ArrivalCargo =   (Cargo & {stuffs: (CargoStuffs & {stuff: (Stuff & {options:(Prisma.JsonValue & {acceptations?:{name:string, from:string, to:string}[]})})})[], logs: (SecurityLog & { person:Person|null })[], confirms: CargoConfirm[], truck: (Truck & {drivers: (TruckDriver & { person: Person})[]}) | null, details: (Prisma.JsonValue & {scale:string, confirmed?: boolean, confirmedReason?:string, confirmedAt:Date, qc?:{ pass:true, label:string, value:string }[], exceptions?: {as:string, desc:string,requestedAt:Date, user: {name:string, family:string}}[]})})
export type CargoConsumption =  (Cargo & {details: {scale?:string, confirm?:boolean, consumed?: DateTime | boolean }, logs: SecurityLog[], stuffs: (CargoStuffs & {stuff: Stuff})[], truck: (Truck & {drivers: (TruckDriver & {person: Person})[], owners: (TruckOwner & {person: Person})[]}) | null, confirms: (CargoConfirm & {user: (User & {profile:Profile})})[]})
export interface Loadings {
  [key:number]: boolean
}
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
export type AppUserWithPermissionFn = AppUser & { can: Can }
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
declare module '#app' {
  interface NuxtApp {
    $io: typeof io
    $socket: ReturnType<typeof io>
  }
}
declare global {
  var io:Server
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
export {}
