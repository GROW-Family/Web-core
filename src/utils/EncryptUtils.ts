import jwt from 'jsonwebtoken';

export const isJwtToken = (data: any) => { if (!data) { return false; } try { return !!jwt.decode(data); } catch (error) { return false; } }

export const jwtEncode = (data: any) => jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: data }, 'secret');

export const jwtDecode = (data: any) => data ? jwt.decode(data) : null;