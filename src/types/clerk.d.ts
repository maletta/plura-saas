import { User as ClerkUser } from '@clerk/types';
import { Role } from '@prisma/client';


// Augmenting the UserPrivateMetadata interface
// declare module '@clerk/nextjs' {
//   interface UserPrivateMetadata {
//     role: string;
//   }
// }


declare global {
  interface UserPrivateMetadata {
    role: Role;  // Adicionando o campo role do tipo string
  }
}