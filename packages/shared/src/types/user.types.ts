export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  lastLogin?: Date;
  isActive: boolean;
}
