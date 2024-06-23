import { AuthCredentialsDto } from '@auth/dto/auth.credentials.dto';
import { AuthResponseDto } from '@auth/dto/auth.response.dto';

export interface IAuthService {
  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - An instance of `AuthCredentialsDto` containing the user's authentication details (e.g., username and password).
   * @returns A promise that resolves to an instance of `AuthResponseDto`, containing authentication details such as access token and refresh token.
   */
  login(credentials: AuthCredentialsDto): Promise<AuthResponseDto>;

  /**
   * Registers a new user with the provided credentials.
   * @param credentials - An instance of `AuthCredentialsDto` containing the user's registration details (e.g., username and password).
   * @returns A promise that resolves to an instance of `AuthResponseDto`, containing authentication details such as access token and refresh token.
   */
  register(credentials: AuthCredentialsDto): Promise<AuthResponseDto>;

  /**
   * Refreshes the authentication tokens using the provided refresh token.
   * @param token - A string representing the refresh token.
   * @returns A promise that resolves to an instance of `AuthResponseDto`, containing the new access token and refresh token.
   */
  refresh(token: string): Promise<AuthResponseDto>;

  /**
   * Logs out the user by invalidating the provided refresh token.
   * @param refreshToken - A string representing the refresh token to be invalidated.
   * @returns A promise that resolves to void, indicating the completion of the logout process.
   */
  logout(refreshToken: string): Promise<void>;
}
