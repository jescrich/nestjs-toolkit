export interface ExtendedNextApiRequest extends NextApiRequest {
  auth: {
    iss: string;
    email: string;
    exp: string;
    user: User;
  };
}
