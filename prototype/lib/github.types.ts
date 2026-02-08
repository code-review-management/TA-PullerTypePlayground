export type user = {
    login: string
    id: number
}

export type repo = {
    id: number
    name: string
    full_name: string
    owner: user
    html_url: string
    description: string | null
}

export type issue = {
    url: string
    id: number
    number: number
    state: string
    title: string
    user: user
    body: string
    created_at: string
    updated_at: string
}

export type pullRequest = {
    url: string
    id: number
    diff_url: string
    number: number
    state: string
    locked: boolean
    title: string
    user: user | null
}