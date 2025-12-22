export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}
