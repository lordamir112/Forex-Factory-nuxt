import { computed } from "vue"


export default{
    getNestedValue: (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }
    ,
    formatDate(date: string | Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions)  {
    return new Date(date).toLocaleDateString(locale, options)
    },
    formFormatDate  (dateStr: string | undefined) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
        }
}