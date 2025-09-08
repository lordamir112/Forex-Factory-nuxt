import { computed } from "vue"


export default{
    getNestedValue: (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }
    ,
    formatDate(date: string | Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions)  {
    return new Date(date).toLocaleDateString(locale, options)
    },
}