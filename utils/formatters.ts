export default{
    getNestedValue: (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }
    ,
    sortItems(items: any[], key: string, order: 'asc' | 'desc' = 'asc') {
    return [...items].sort((a, b) => {
        const valA = this.getNestedValue(a, key)
        const valB = this.getNestedValue(b, key)

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
    })
    },
    formatDate(date: string | Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions)  {
    return new Date(date).toLocaleDateString(locale, options)
    },
}