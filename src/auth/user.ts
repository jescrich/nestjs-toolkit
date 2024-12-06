// This should be a real class/interface representing a user entity
/**
 * Represents a user with various optional and required properties.
 *
 * @typedef {Object} IUser
 * @property {string} [email] - The email address of the user.
 * @property {string} username - The username of the user.
 * @property {string} [name] - The full name of the user.
 * @property {string} [photo] - The URL to the user's photo.
 * @property {string} [externalId] - An external identifier for the user.
 * @property {string} [displayName] - The display name of the user.
 * @property {string[]} [roles] - A list of roles assigned to the user.
 * @property {Array<{name: string, roles: string[]}>} [profiles] - A list of profiles associated with the user, each containing a name and roles.
 * @property {string} [thirdPartyToken] - A token for third-party authentication.
 * @property {string} [defaultOrganization] - The default organization of the user.
 * @property {Array<{urn: string, name: string, roles: string[]}>} [organizations] - A list of organizations the user belongs to, each containing a URN, name, and roles.
 */
export type IUser = {
  email?: string;
  username: string;
  name?: string;
  photo?: string;
  externalId?: string;
  displayName?: string;
  roles?: string[];
  profiles?: {
    name: string;
    roles: string[];
  }[];
  thirdPartyToken?: string;
  defaultOrganization?: string;
  organizations?: [
    {
      urn: string;
      name: string;
      roles: string[];
    }
  ]
};

export default IUser;
