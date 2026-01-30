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

export type issue = {
    url: string
    id: Number
    number: Number
    state: string
    title: string
    user: {
        login: string
        id: Number
    }
    body: string
    created_at: string
    updated_at: string
}
