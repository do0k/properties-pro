import type { RouteRecordName } from 'vue-router'
import type { Ref } from 'vue'
import type { FetchError } from 'ofetch'
import type { Can, MenuItem } from '~/types'

// noinspection JSUnusedGlobalSymbols
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export const getUserMenu = (menu: MenuItem[], can: Can): MenuItem[] => {
  const _menu: MenuItem[] = []
  menu.forEach((item) => {
    if (item.items) {
      const items = getUserMenu(item.items, can)
      if (items.length > 0) {
        _menu.push({
          ...item,
          items
        })
      }
    } else {
      const canAccess = item.permissions?.reduce((bool, p) => bool || can(p), false) || false
      if (canAccess) { _menu.push(item) }
    }
  })
  return _menu
}

export const getCurrentRouteIndex = (menu: Array<MenuItem> | null, routeName: RouteRecordName, index = ''): string => {
  let str = ''
  menu?.forEach((item, i) => {
    if (item.items && str === '') {
      str = getCurrentRouteIndex(item.items, routeName, `${i + 1}_`)
    } else
    if (item.route?.name === routeName) {
      str = `item_${index}${i + 1}`
    }
  })
  return str
}

export const err = (e:Ref<FetchError | null>) => {
  if (e.value) {
    if (e.value?.statusCode === 422) {
      Object.keys(e.value?.data.data).forEach((key) => {
        ElMessage({
          message: e.value?.data.data[key][0],
          grouping: true,
          type: 'warning',
          showClose: true
        })
      })
    } else {
      ElMessage({
        message: e.value?.data.message,
        grouping: true,
        type: (e.value?.statusCode || 400) >= 500 ? 'error' : 'warning',
        showClose: true
      })
    }
  }
}
export const msg = (data:Ref<{message:string} | null>, type:'info'|'success'|'error'|'warning' = 'success'):boolean => {
  if (data.value) {
    ElMessage({
      message: data.value?.message,
      type
    })
    return true
  }
  return false
}

export const getUrlParamValue = (url:string, paramName: string) => {
  const params:URLSearchParams = new URLSearchParams(new URL(url.toLowerCase()).search)
  const paramValue = params.get(paramName.toLowerCase())?.trim()
  return paramValue ? decodeURIComponent(paramValue) : null
}
export const getRouteFromUrl = (url:string) => {
  const { appUrl } = useRuntimeConfig().public
  let _url = getUrlParamValue(url, 'callbackUrl')
  if (_url) {
    if (_url.startsWith(appUrl)) {
      _url = '/' + _url.replace(appUrl, '').replace(/^\/+|\/+$/, '')
    }
    return _url
  }
  return '/'
}

export const mergePerms = (slave:string[], master:string[]):string[] | Promise<string[]> => {
  return slave.reduce((acc, curr) => {
    const [key, value] = curr.split(':')
    const index = acc.findIndex(item => item.startsWith(`${key}:`))
    if (index !== -1) {
      const [existingKey, existingValue] = acc[index].split(':')
      acc[index] = `${existingKey}:${Math.max(parseInt(existingValue), parseInt(value))}`
    } else {
      acc.push(curr)
    }
    return acc
  }, master).sort()
}

export const sum = (arr:any[]):number => {
  return arr.reduce((sum, item) => sum + parseInt(item.paid), 0)
}

export const humanDate = (date:Date|string) => {
  if (typeof date === 'string') { date = new Date(date) }
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffSeconds = Math.round(diff / 1000)
  const diffMinutes = Math.round(diff / (1000 * 60))
  const diffHours = Math.round(diff / (1000 * 60 * 60))
  const diffDays = Math.round(diff / (1000 * 60 * 60 * 24))
  const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())

  if (diffSeconds < 10) {
    return 'همین الان'
  } else if (diffSeconds < 60) {
    return `${diffSeconds} ثانیه پیش`
  } else if (diffMinutes === 1) {
    return 'یک دقیقه پیش'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} دقیقه پیش`
  } else if (diffHours === 1) {
    return 'یک ساعت پیش'
  } else if (diffHours < 24) {
    return `${diffHours} ساعت پیش`
  } else if (diffDays === 1) {
    return 'دیروز'
  } else if (diffDays < 30) {
    return `${diffDays} روز پیش`
  } else if (diffMonths === 1) {
    return 'یک ماه پیش'
  } else if (diffMonths < 12) {
    return `${diffMonths} ماه پیش`
  } else {
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}
export const randomNumber = () => Math.floor(Math.random() * (new Date()).getTime())
