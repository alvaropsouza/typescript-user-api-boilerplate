export interface UserRegisterType {
    name: string
    email: string
    password: string
    active?: boolean
}

export interface UserLoginType {
    email: string
    password: string
}

export interface UserUpdateType {
    password: string
    newPassword: string
}

export interface GetUserResponseType {
    name: string
    email: string
    active: boolean
    updatedAt: Date
    createdAt: Date
}
