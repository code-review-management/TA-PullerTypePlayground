export type repo = {
    id: Number
    name: string
    full_name: string
    owner: {
        login: string
        id: Number
    }
    html_url: string
    description: string
}