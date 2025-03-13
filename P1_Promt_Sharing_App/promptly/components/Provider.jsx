'use client';

import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => (
  // Purpose: Wrap the app to provide session context.
    //   Workflow:
    // Accepts session prop (typically server-side session data).
    // Passes it to SessionProvider to initialize client-side session state.
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

export default Provider;
