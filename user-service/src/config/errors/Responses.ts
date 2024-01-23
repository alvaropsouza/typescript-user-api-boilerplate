import { Response } from 'express'
import { HttpResponse } from './http'

export const badRequest = async (res: Response, error?: unknown): Promise<HttpResponse> =>
    res.status(400).send({
        statusCode: 400,
        body: error || 'Invalid payload'
    })

export const internalServerError = async (res: Response): Promise<HttpResponse> =>
    res.status(500).send({
        statusCode: 500,
        body: 'Internal server error'
    })

export const forbidden = async (res: Response, error?: string): Promise<HttpResponse> =>
    res.status(403).send({
        statusCode: 403,
        body: error || 'Forbidden'
    })

export const notFound = async (res: Response): Promise<HttpResponse> =>
    res.status(404).send({
        statusCode: 404,
        body: 'Not found'
    })

export const ok = async (res: Response, result?: unknown): Promise<HttpResponse> =>
    res.status(200).send(result)

export const created = async (res: Response): Promise<HttpResponse> => res.status(201).send()

export const noContent = async (res: Response): Promise<HttpResponse> => res.status(204).send()
