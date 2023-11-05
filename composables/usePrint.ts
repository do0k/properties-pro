import { domToDataUrl } from 'modern-screenshot'
export const usePrint = async (target: string | HTMLElement) => {
  if (process.client) {
    const element = typeof target === 'string' ? document.getElementById(target) : target
    if (element) {
      const dataUrl = await domToDataUrl(element, {})
      const win = window.open('', '', 'width=800,height=530')
      win?.document.open()
      win?.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Print</title></head>
        <body><img src="${dataUrl}" alt="PRINT"/></body>
      </html>
      `)
      win?.document.close()
      await delay(1000)
      win?.focus()
      win?.print()
      win?.close()
    }
  }
}
