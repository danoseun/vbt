import jwt from "jsonwebtoken";

import variables from "../variables";
import { BadRequestError } from "../errors";

export class JWT {
  private static secret: jwt.Secret = variables.auth.jwtSecret;

  public static encode<T>(
    payload: Partial<T>,
    options?: Partial<jwt.SignOptions>
  ): string {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: "60s",
      ...options,
    });
    return token;
  }

  public static decode(token: string): jwt.JwtPayload {
    if (!token) {
      throw new BadRequestError("token must be supplied");
    }
    const decoded = jwt.verify(token, this.secret);
    return decoded as jwt.JwtPayload;
  }
}
